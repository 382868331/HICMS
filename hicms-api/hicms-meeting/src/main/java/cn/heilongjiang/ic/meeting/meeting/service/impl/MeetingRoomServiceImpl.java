package cn.heilongjiang.ic.meeting.meeting.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingRoom;
import cn.heilongjiang.ic.meeting.meeting.mapper.MeetingRoomMapper;
import cn.heilongjiang.ic.meeting.meeting.service.IMeetingRoomService;

/**
 * 会议室 服务层实现
 * 
 * @author hicms
 */
@Service
public class MeetingRoomServiceImpl implements IMeetingRoomService
{
    @Autowired
    private MeetingRoomMapper meetingRoomMapper;

    /**
     * 查询会议室列表
     */
    @Override
    public List<MeetingRoom> selectMeetingRoomList(MeetingRoom meetingRoom)
    {
        return meetingRoomMapper.selectMeetingRoomList(meetingRoom);
    }

    @Override
    public int insertMeetingRoom(MeetingRoom meetingRoom)
    {
        return meetingRoomMapper.insertMeetingRoom(meetingRoom);
    }

    @Override
    public int updateMeetingRoom(MeetingRoom meetingRoom)
    {
        return meetingRoomMapper.updateMeetingRoom(meetingRoom);
    }

    @Override
    public int deleteMeetingRoomById(Long roomId)
    {
        return meetingRoomMapper.deleteMeetingRoomById(roomId);
    }

    @Override
    public int deleteMeetingRoomByIds(Long[] roomIds)
    {
        return meetingRoomMapper.deleteMeetingRoomByIds(roomIds);
    }
}
