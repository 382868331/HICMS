package cn.heilongjiang.ic.meeting.meeting.controller;

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
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingMember;
import cn.heilongjiang.ic.meeting.meeting.service.IMeetingMemberService;

/**
 * 通讯录成员Controller
 *
 * @author hicms
 */
@RestController
@RequestMapping("/meeting/member")
public class MeetingMemberController extends BaseController
{
    @Autowired
    private IMeetingMemberService meetingMemberService;

    /**
     * 分页+条件查询通讯录成员列表（不传pageNum/pageSize则为全量查询）
     */
    @GetMapping("/list")
    public TableDataInfo list(MeetingMember meetingMember)
    {
        startPage();
        List<MeetingMember> list = meetingMemberService.selectMeetingMemberList(meetingMember);
        return getDataTable(list);
    }

    /**
     * 根据主键查询详情
     */
    @GetMapping("/{memberId}")
    public AjaxResult getInfo(@PathVariable("memberId") Long memberId)
    {
        return success(meetingMemberService.selectMeetingMemberById(memberId));
    }

    /**
     * 新增通讯录成员
     */
    @PostMapping
    public AjaxResult add(@RequestBody MeetingMember meetingMember)
    {
        return toAjax(meetingMemberService.insertMeetingMember(meetingMember));
    }

    /**
     * 修改通讯录成员
     */
    @PutMapping
    public AjaxResult edit(@RequestBody MeetingMember meetingMember)
    {
        return toAjax(meetingMemberService.updateMeetingMember(meetingMember));
    }

    /**
     * 删除通讯录成员（支持批量，memberIds以逗号分隔如"1,2,3"）
     */
    @DeleteMapping("/{memberIds}")
    public AjaxResult remove(@PathVariable Long[] memberIds)
    {
        return toAjax(meetingMemberService.deleteMeetingMemberByIds(memberIds));
    }
}
