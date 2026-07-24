package cn.heilongjiang.ic.meeting.meeting.domain;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import cn.heilongjiang.ic.meeting.common.core.domain.BaseEntity;

/**
 * 会议室表 meeting_room
 * 
 * @author hicms
 */
public class MeetingRoom extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 会议室ID */
    private Long roomId;

    /** 会议室名称 */
    private String name;

    /** 正常容纳人数 */
    private Integer normalCapacity;

    /** 疫情容纳人数 */
    private Integer covidCapacity;

    /** 适用范围 */
    private String applicableScope;

    /** 会场摆放 */
    private String layout;

    /** 会场米数 */
    private String areaSize;

    /** 图片URL */
    private String imageUrl;

    /** 预定情况（JSON串，列表元素包含：预定人、预定开始时间、预定结束时间） */
    private String bookingJson;

    public Long getRoomId()
    {
        return roomId;
    }

    public void setRoomId(Long roomId)
    {
        this.roomId = roomId;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public Integer getNormalCapacity()
    {
        return normalCapacity;
    }

    public void setNormalCapacity(Integer normalCapacity)
    {
        this.normalCapacity = normalCapacity;
    }

    public Integer getCovidCapacity()
    {
        return covidCapacity;
    }

    public void setCovidCapacity(Integer covidCapacity)
    {
        this.covidCapacity = covidCapacity;
    }

    public String getApplicableScope()
    {
        return applicableScope;
    }

    public void setApplicableScope(String applicableScope)
    {
        this.applicableScope = applicableScope;
    }

    public String getLayout()
    {
        return layout;
    }

    public void setLayout(String layout)
    {
        this.layout = layout;
    }

    public String getAreaSize()
    {
        return areaSize;
    }

    public void setAreaSize(String areaSize)
    {
        this.areaSize = areaSize;
    }

    public String getImageUrl()
    {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl)
    {
        this.imageUrl = imageUrl;
    }

    public String getBookingJson()
    {
        return bookingJson;
    }

    public void setBookingJson(String bookingJson)
    {
        this.bookingJson = bookingJson;
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this,ToStringStyle.MULTI_LINE_STYLE)
            .append("roomId", getRoomId())
            .append("name", getName())
            .append("normalCapacity", getNormalCapacity())
            .append("covidCapacity", getCovidCapacity())
            .append("applicableScope", getApplicableScope())
            .append("layout", getLayout())
            .append("areaSize", getAreaSize())
            .append("imageUrl", getImageUrl())
            .append("bookingJson", getBookingJson())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
