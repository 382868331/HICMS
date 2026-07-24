package cn.heilongjiang.ic.meeting.meeting.domain;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import cn.heilongjiang.ic.meeting.common.core.domain.BaseEntity;

/**
 * 会议预定对象 meeting_book
 *
 * @author hicms
 */
public class MeetingBook extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long bookId;

    /** 会议室名称 */
    private String roomName;

    /** 会议室ID */
    private Long roomId;

    /** 预定人名称 */
    private String bookerName;

    /** 预定人ID */
    private Long bookerId;

    /** 会议名称 */
    private String meetingName;

    /** 领导名称 */
    private String leaderName;

    /** 音频文件URL */
    private String audioFileUrl;

    /** 音频转录文字文件URL */
    private String audioTranscriptUrl;

    /** 会议开始时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date meetingStartTime;

    /** 会议结束时间 */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date meetingEndTime;

    /** 会序PDF文件URL */
    private String agendaPdfUrl;

    /** 座位图URL */
    private String seatMapUrl;

    /** 是否线上(0否 1是) */
    private String isOnline;

    /** 是否好信云(0否 1是) */
    private String isHxy;

    /** 是否机要局专线(0否 1是) */
    private String isJyjLine;

    /** 是否国办专线(0否 1是) */
    private String isGbLine;

    /** 是否取消(0否 1是) */
    private String isCanceled;

    /** 是否结束(0否 1是) */
    private String isFinished;

    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getBookerName() { return bookerName; }
    public void setBookerName(String bookerName) { this.bookerName = bookerName; }

    public Long getBookerId() { return bookerId; }
    public void setBookerId(Long bookerId) { this.bookerId = bookerId; }

    public String getMeetingName() { return meetingName; }
    public void setMeetingName(String meetingName) { this.meetingName = meetingName; }

    public String getLeaderName() { return leaderName; }
    public void setLeaderName(String leaderName) { this.leaderName = leaderName; }

    public String getAudioFileUrl() { return audioFileUrl; }
    public void setAudioFileUrl(String audioFileUrl) { this.audioFileUrl = audioFileUrl; }

    public String getAudioTranscriptUrl() { return audioTranscriptUrl; }
    public void setAudioTranscriptUrl(String audioTranscriptUrl) { this.audioTranscriptUrl = audioTranscriptUrl; }

    public Date getMeetingStartTime() { return meetingStartTime; }
    public void setMeetingStartTime(Date meetingStartTime) { this.meetingStartTime = meetingStartTime; }

    public Date getMeetingEndTime() { return meetingEndTime; }
    public void setMeetingEndTime(Date meetingEndTime) { this.meetingEndTime = meetingEndTime; }

    public String getAgendaPdfUrl() { return agendaPdfUrl; }
    public void setAgendaPdfUrl(String agendaPdfUrl) { this.agendaPdfUrl = agendaPdfUrl; }

    public String getSeatMapUrl() { return seatMapUrl; }
    public void setSeatMapUrl(String seatMapUrl) { this.seatMapUrl = seatMapUrl; }

    public String getIsOnline() { return isOnline; }
    public void setIsOnline(String isOnline) { this.isOnline = isOnline; }

    public String getIsHxy() { return isHxy; }
    public void setIsHxy(String isHxy) { this.isHxy = isHxy; }

    public String getIsJyjLine() { return isJyjLine; }
    public void setIsJyjLine(String isJyjLine) { this.isJyjLine = isJyjLine; }

    public String getIsGbLine() { return isGbLine; }
    public void setIsGbLine(String isGbLine) { this.isGbLine = isGbLine; }

    public String getIsCanceled() { return isCanceled; }
    public void setIsCanceled(String isCanceled) { this.isCanceled = isCanceled; }

    public String getIsFinished() { return isFinished; }
    public void setIsFinished(String isFinished) { this.isFinished = isFinished; }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("bookId", getBookId())
            .append("roomName", getRoomName())
            .append("roomId", getRoomId())
            .append("bookerName", getBookerName())
            .append("bookerId", getBookerId())
            .append("meetingName", getMeetingName())
            .append("leaderName", getLeaderName())
            .append("audioFileUrl", getAudioFileUrl())
            .append("audioTranscriptUrl", getAudioTranscriptUrl())
            .append("meetingStartTime", getMeetingStartTime())
            .append("meetingEndTime", getMeetingEndTime())
            .append("agendaPdfUrl", getAgendaPdfUrl())
            .append("seatMapUrl", getSeatMapUrl())
            .append("isOnline", getIsOnline())
            .append("isHxy", getIsHxy())
            .append("isJyjLine", getIsJyjLine())
            .append("isGbLine", getIsGbLine())
            .append("isCanceled", getIsCanceled())
            .append("isFinished", getIsFinished())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
