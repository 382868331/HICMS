package cn.heilongjiang.ic.meeting.meeting.domain;

import java.util.Date;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import cn.heilongjiang.ic.meeting.common.core.domain.BaseEntity;

/**
 * 通讯录成员对象 meeting_member
 *
 * @author hicms
 */
public class MeetingMember extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    /** 主键ID */
    private Long memberId;

    /** 用户ID */
    private String userId;

    /** 用户名 */
    private String userName;

    /** 手机号 */
    private String phone;

    /** 微信号 */
    private String wechat;

    /** 邮箱 */
    private String email;

    /** 部门 */
    private String department;

    /** 值班日期 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dutyDate;

    /** 是否授权小程序(0否 1是) */
    private String isMiniappAuth;

    /** 是否信息中心人员(0否 1是) */
    private String isInfoCenter;

    /** 是否机要局人员(0否 1是) */
    private String isJiyaoBureau;

    /** 是否办会人员(0否 1是) */
    private String isMeetingOrganizer;

    /** 是否当前值班人员(0否 1是) */
    private String isCurrentDuty;

    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWechat() { return wechat; }
    public void setWechat(String wechat) { this.wechat = wechat; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Date getDutyDate() { return dutyDate; }
    public void setDutyDate(Date dutyDate) { this.dutyDate = dutyDate; }

    public String getIsMiniappAuth() { return isMiniappAuth; }
    public void setIsMiniappAuth(String isMiniappAuth) { this.isMiniappAuth = isMiniappAuth; }

    public String getIsInfoCenter() { return isInfoCenter; }
    public void setIsInfoCenter(String isInfoCenter) { this.isInfoCenter = isInfoCenter; }

    public String getIsJiyaoBureau() { return isJiyaoBureau; }
    public void setIsJiyaoBureau(String isJiyaoBureau) { this.isJiyaoBureau = isJiyaoBureau; }

    public String getIsMeetingOrganizer() { return isMeetingOrganizer; }
    public void setIsMeetingOrganizer(String isMeetingOrganizer) { this.isMeetingOrganizer = isMeetingOrganizer; }

    public String getIsCurrentDuty() { return isCurrentDuty; }
    public void setIsCurrentDuty(String isCurrentDuty) { this.isCurrentDuty = isCurrentDuty; }

    @Override
    public String toString()
    {
        return new ToStringBuilder(this, ToStringStyle.MULTI_LINE_STYLE)
            .append("memberId", getMemberId())
            .append("userId", getUserId())
            .append("userName", getUserName())
            .append("phone", getPhone())
            .append("wechat", getWechat())
            .append("email", getEmail())
            .append("department", getDepartment())
            .append("dutyDate", getDutyDate())
            .append("isMiniappAuth", getIsMiniappAuth())
            .append("isInfoCenter", getIsInfoCenter())
            .append("isJiyaoBureau", getIsJiyaoBureau())
            .append("isMeetingOrganizer", getIsMeetingOrganizer())
            .append("isCurrentDuty", getIsCurrentDuty())
            .append("createBy", getCreateBy())
            .append("createTime", getCreateTime())
            .append("updateBy", getUpdateBy())
            .append("updateTime", getUpdateTime())
            .append("remark", getRemark())
            .toString();
    }
}
