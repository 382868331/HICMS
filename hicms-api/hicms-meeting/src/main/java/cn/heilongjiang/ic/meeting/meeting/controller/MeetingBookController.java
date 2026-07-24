package cn.heilongjiang.ic.meeting.meeting.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import cn.heilongjiang.ic.meeting.common.core.controller.BaseController;
import cn.heilongjiang.ic.meeting.common.core.domain.AjaxResult;
import cn.heilongjiang.ic.meeting.common.core.page.TableDataInfo;
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingBook;
import cn.heilongjiang.ic.meeting.meeting.service.IMeetingBookService;

/**
 * 会议预定 信息操作处理
 *
 * @author hicms
 */
@RestController
@RequestMapping("/meeting/book")
public class MeetingBookController extends BaseController
{
    @Autowired
    private IMeetingBookService meetingBookService;

    /**
     * 获取会议预定列表（条件+分页）
     */
    @GetMapping("/list")
    public TableDataInfo list(MeetingBook meetingBook)
    {
        startPage();
        List<MeetingBook> list = meetingBookService.selectMeetingBookList(meetingBook);
        return getDataTable(list);
    }

    /**
     * 新增会议预定
     */
    @PostMapping
    public AjaxResult add(@RequestBody MeetingBook meetingBook)
    {
        // 根据 token 自动补全预定人信息
        meetingBook.setBookerId(getUserId());
        meetingBook.setBookerName(getLoginUser().getUser().getNickName());
        meetingBook.setCreateBy(getUsername());

        // 校验会议开始时间必须在当前时间 ~ 七天后之间
        Date startTime = meetingBook.getMeetingStartTime();
        if (startTime == null)
        {
            return AjaxResult.error("会议开始时间不能为空");
        }
        Date now = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(now);
        cal.add(Calendar.DAY_OF_MONTH, 7);
        Date sevenDaysLater = cal.getTime();

        if (startTime.before(now))
        {
            return AjaxResult.error("会议开始时间不能早于当前时间");
        }
        if (startTime.after(sevenDaysLater))
        {
            return AjaxResult.error("只能预定七天之内的会议");
        }

        // 如果没填结束时间，默认结束时间 = 开始时间 + 1小时
        Date endTime = meetingBook.getMeetingEndTime();
        if (endTime == null)
        {
            Calendar endCal = Calendar.getInstance();
            endCal.setTime(startTime);
            endCal.add(Calendar.HOUR_OF_DAY, 1);
            endTime = endCal.getTime();
            meetingBook.setMeetingEndTime(endTime);
        }

        // 校验：结束时间必须晚于开始时间
        if (!endTime.after(startTime))
        {
            return AjaxResult.error("会议结束时间必须晚于开始时间");
        }

        // 校验：开始~结束时间差不能超过 8 小时
        long diffMs = endTime.getTime() - startTime.getTime();
        if (diffMs > 8L * 60 * 60 * 1000)
        {
            return AjaxResult.error("会议时间不能超过 8 小时");
        }

        // 校验：结束时间也不能超过七天后
        if (endTime.after(sevenDaysLater))
        {
            return AjaxResult.error("会议结束时间不能超过七天后");
        }

        // 检查是否与已有预定时间冲突
        List<MeetingBook> overlapping = meetingBookService.selectOverlapping(
                meetingBook.getRoomId(), meetingBook.getMeetingStartTime(), meetingBook.getMeetingEndTime());
        if (overlapping != null && !overlapping.isEmpty())
        {
            return AjaxResult.error("该时间段已被预定，请选择其他时间");
        }

        return toAjax(meetingBookService.insertMeetingBook(meetingBook));
    }

    /**
     * 修改会议预定
     */
    @PutMapping
    public AjaxResult edit(@RequestBody MeetingBook meetingBook)
    {
        Long bookId = meetingBook.getBookId();
        if (bookId == null)
        {
            return AjaxResult.error("预定ID不能为空");
        }

        // 如果是在操作取消/恢复状态，需要校验权限和时间
        String isCanceled = meetingBook.getIsCanceled();
        if ("1".equals(isCanceled) || "0".equals(isCanceled))
        {
            MeetingBook existing = meetingBookService.selectMeetingBookById(bookId);
            if (existing == null)
            {
                return AjaxResult.error("会议预定不存在");
            }
            // 只能操作自己的会议
            if (!getUserId().equals(existing.getBookerId()))
            {
                return AjaxResult.error("只能操作自己的会议");
            }
            // 已结束的会议不能操作
            if ("1".equals(existing.getIsFinished()))
            {
                return AjaxResult.error("已结束的会议不能操作");
            }
            // 已超过开始时间的会议不能取消或恢复
            Date startTime = existing.getMeetingStartTime();
            if (startTime != null && startTime.before(new Date()))
            {
                return AjaxResult.error("已超过会议开始时间，不能操作");
            }
        }

        meetingBook.setUpdateBy(getUsername());
        return toAjax(meetingBookService.updateMeetingBook(meetingBook));
    }

    /**
     * 删除会议预定（支持批量）
     */
    @DeleteMapping("/{bookIds}")
    public AjaxResult remove(@PathVariable Long[] bookIds)
    {
        return toAjax(meetingBookService.deleteMeetingBookByIds(bookIds));
    }
}
