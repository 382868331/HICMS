package cn.heilongjiang.ic.meeting.common.enums;

import java.util.function.Function;
import cn.heilongjiang.ic.meeting.common.utils.DesensitizedUtil;

/**
 * 脱敏类型
 *
 * @author hicms
 */
public enum DesensitizedType
{
    /**
     * 姓名，第2位星号替?
     */
    USERNAME(s -> s.replaceAll("(\\S)\\S(\\S*)", "$1*$2")),

    /**
     * 密码，全部字符都?代替
     */
    PASSWORD(DesensitizedUtil::password),

    /**
     * 身份证，中间10位星号替?
     */
    ID_CARD(s -> s.replaceAll("(\\d{4})\\d{10}(\\d{3}[Xx]|\\d{4})", "$1** **** ****$2")),

    /**
     * 手机号，中间4位星号替?
     */
    PHONE(s -> s.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2")),

    /**
     * 电子邮箱，仅显示第一个字母和@后面的地址显示，其他星号替?
     */
    EMAIL(s -> s.replaceAll("(^.)[^@]*(@.*$)", "$1****$2")),

    /**
     * 银行卡号，保留最?位，其他星号替换
     */
    BANK_CARD(s -> s.replaceAll("\\d{15}(\\d{3})", "**** **** **** **** $1")),

    /**
     * 车牌号码，包含普通车辆、新能源车辆
     */
    CAR_LICENSE(DesensitizedUtil::carLicense);

    private final Function<String, String> desensitizer;

    DesensitizedType(Function<String, String> desensitizer)
    {
        this.desensitizer = desensitizer;
    }

    public Function<String, String> desensitizer()
    {
        return desensitizer;
    }
}
