package cn.heilongjiang.ic.meeting.meeting.mapper;

import java.util.List;
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingRoom;

/**
 * 会议室 数据层
 * 
 * @author hicms
 */
public interface MeetingRoomMapper
{
    /**
     * 查询会议室列表
     * 
     * @param meetingRoom 会议室信息
     * @return 会议室集合
     */
    public List<MeetingRoom> selectMeetingRoomList(MeetingRoom meetingRoom);

    /**
     * 新增会议室
     */
    public int insertMeetingRoom(MeetingRoom meetingRoom);

    /**
     * 修改会议室
     */
    public int updateMeetingRoom(MeetingRoom meetingRoom);

    /**
     * 删除会议室
     */
    public int deleteMeetingRoomById(Long roomId);

    /**
     * 批量删除会议室
     */
    public int deleteMeetingRoomByIds(Long[] roomIds);
}
