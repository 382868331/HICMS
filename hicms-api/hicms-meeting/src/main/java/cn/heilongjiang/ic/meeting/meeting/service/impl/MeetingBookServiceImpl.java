package cn.heilongjiang.ic.meeting.meeting.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingBook;
import cn.heilongjiang.ic.meeting.meeting.mapper.MeetingBookMapper;
import cn.heilongjiang.ic.meeting.meeting.service.IMeetingBookService;

/**
 * 会议预定Service业务层处理
 *
 * @author hicms
 */
@Service
public class MeetingBookServiceImpl implements IMeetingBookService
{
    @Autowired
    private MeetingBookMapper meetingBookMapper;

    @Override
    public List<MeetingBook> selectMeetingBookList(MeetingBook meetingBook)
    {
        return meetingBookMapper.selectMeetingBookList(meetingBook);
    }

    @Override
    public int insertMeetingBook(MeetingBook meetingBook)
    {
        return meetingBookMapper.insertMeetingBook(meetingBook);
    }

    @Override
    public int updateMeetingBook(MeetingBook meetingBook)
    {
        return meetingBookMapper.updateMeetingBook(meetingBook);
    }

    @Override
    public int deleteMeetingBookById(Long bookId)
    {
        return meetingBookMapper.deleteMeetingBookById(bookId);
    }

    @Override
    public int deleteMeetingBookByIds(Long[] bookIds)
    {
        return meetingBookMapper.deleteMeetingBookByIds(bookIds);
    }

    @Override
    public List<MeetingBook> selectOverlapping(Long roomId, java.util.Date startTime, java.util.Date endTime)
    {
        return meetingBookMapper.selectOverlapping(roomId, startTime, endTime);
    }

    @Override
    public MeetingBook selectMeetingBookById(Long bookId)
    {
        return meetingBookMapper.selectMeetingBookById(bookId);
    }

    @Override
    public int updateOverdueMeetings()
    {
        return meetingBookMapper.updateOverdueMeetings();
    }
}
