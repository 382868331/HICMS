package cn.heilongjiang.ic.meeting.meeting.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingMember;
import cn.heilongjiang.ic.meeting.meeting.mapper.MeetingMemberMapper;
import cn.heilongjiang.ic.meeting.meeting.service.IMeetingMemberService;

/**
 * 通讯录成员Service业务层处理
 *
 * @author hicms
 */
@Service
public class MeetingMemberServiceImpl implements IMeetingMemberService
{
    @Autowired
    private MeetingMemberMapper meetingMemberMapper;

    @Override
    public List<MeetingMember> selectMeetingMemberList(MeetingMember meetingMember)
    {
        return meetingMemberMapper.selectMeetingMemberList(meetingMember);
    }

    @Override
    public MeetingMember selectMeetingMemberById(Long memberId)
    {
        return meetingMemberMapper.selectMeetingMemberById(memberId);
    }

    @Override
    public int insertMeetingMember(MeetingMember meetingMember)
    {
        return meetingMemberMapper.insertMeetingMember(meetingMember);
    }

    @Override
    public int updateMeetingMember(MeetingMember meetingMember)
    {
        return meetingMemberMapper.updateMeetingMember(meetingMember);
    }

    @Override
    public int deleteMeetingMemberById(Long memberId)
    {
        return meetingMemberMapper.deleteMeetingMemberById(memberId);
    }

    @Override
    public int deleteMeetingMemberByIds(Long[] memberIds)
    {
        return meetingMemberMapper.deleteMeetingMemberByIds(memberIds);
    }
}
