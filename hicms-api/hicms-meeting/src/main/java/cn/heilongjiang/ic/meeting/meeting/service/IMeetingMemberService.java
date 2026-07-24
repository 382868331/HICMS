package cn.heilongjiang.ic.meeting.meeting.service;

import java.util.List;
import cn.heilongjiang.ic.meeting.meeting.domain.MeetingMember;

/**
 * 通讯录成员Service接口
 *
 * @author hicms
 */
public interface IMeetingMemberService
{
    /**
     * 分页+条件查询通讯录成员列表
     */
    List<MeetingMember> selectMeetingMemberList(MeetingMember meetingMember);

    /**
     * 根据主键查询
     */
    MeetingMember selectMeetingMemberById(Long memberId);

    /**
     * 新增通讯录成员
     */
    int insertMeetingMember(MeetingMember meetingMember);

    /**
     * 修改通讯录成员
     */
    int updateMeetingMember(MeetingMember meetingMember);

    /**
     * 删除通讯录成员
     */
    int deleteMeetingMemberById(Long memberId);

    /**
     * 批量删除通讯录成员
     */
    int deleteMeetingMemberByIds(Long[] memberIds);
}
