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
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingRoom;
import cn.heilongjiang.ic.meeting.meeting.service.IMeetingRoomService;

/**
 * 会议室 信息操作处理
 * 
 * @author hicms
 */
@RestController
@RequestMapping("/meeting/room")
public class MeetingRoomController extends BaseController
{
    @Autowired
    private IMeetingRoomService meetingRoomService;

    /**
     * 获取会议室列表
     */
    @GetMapping("/list")
    public TableDataInfo list(MeetingRoom meetingRoom)
    {
        startPage();
        List<MeetingRoom> list = meetingRoomService.selectMeetingRoomList(meetingRoom);
        return getDataTable(list);
    }

    /**
     * 新增会议室
     */
    @PostMapping
    public AjaxResult add(@RequestBody MeetingRoom meetingRoom)
    {
        meetingRoom.setCreateBy(getUsername());
        return toAjax(meetingRoomService.insertMeetingRoom(meetingRoom));
    }

    /**
     * 修改会议室
     */
    @PutMapping
    public AjaxResult edit(@RequestBody MeetingRoom meetingRoom)
    {
        meetingRoom.setUpdateBy(getUsername());
        return toAjax(meetingRoomService.updateMeetingRoom(meetingRoom));
    }

    /**
     * 删除会议室（支持批量）
     */
    @DeleteMapping("/{roomIds}")
    public AjaxResult remove(@PathVariable Long[] roomIds)
    {
        return toAjax(meetingRoomService.deleteMeetingRoomByIds(roomIds));
    }
}
