package cn.heilongjiang.ic.meeting.meeting.mapper;

import java.util.List;
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingBook;

/**
 * 会议预定Mapper接口
 *
 * @author hicms
 */
public interface MeetingBookMapper
{
    /**
     * 查询会议预定列表
     */
    List<MeetingBook> selectMeetingBookList(MeetingBook meetingBook);

    /**
     * 新增会议预定
     */
    int insertMeetingBook(MeetingBook meetingBook);

    /**
     * 修改会议预定
     */
    int updateMeetingBook(MeetingBook meetingBook);

    /**
     * 删除会议预定
     */
    int deleteMeetingBookById(Long bookId);

    /**
     * 批量删除会议预定
     */
    int deleteMeetingBookByIds(Long[] bookIds);

    /**
     * 查询同一会议室在时间段内未取消的预定（用于冲突检测）
     */
    List<MeetingBook> selectOverlapping(@org.apache.ibatis.annotations.Param("roomId") Long roomId,
                                        @org.apache.ibatis.annotations.Param("startTime") java.util.Date startTime,
                                        @org.apache.ibatis.annotations.Param("endTime") java.util.Date endTime);

    /**
     * 根据主键查询会议预定
     */
    MeetingBook selectMeetingBookById(Long bookId);

    /**
     * 将已过开始时间的会议标记为已结束
     */
    int updateOverdueMeetings();
}
