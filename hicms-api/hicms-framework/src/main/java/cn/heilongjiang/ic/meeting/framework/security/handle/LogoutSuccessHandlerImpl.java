package cn.heilongjiang.ic.meeting.framework.security.handle;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import com.alibaba.fastjson2.JSON;
import cn.heilongjiang.ic.meeting.common.constant.Constants;
import cn.heilongjiang.ic.meeting.common.core.domain.AjaxResult;
import cn.heilongjiang.ic.meeting.common.core.domain.model.LoginUser;
import cn.heilongjiang.ic.meeting.common.utils.MessageUtils;
import cn.heilongjiang.ic.meeting.common.utils.ServletUtils;
import cn.heilongjiang.ic.meeting.common.utils.StringUtils;
import cn.heilongjiang.ic.meeting.framework.manager.AsyncManager;
import cn.heilongjiang.ic.meeting.framework.manager.factory.AsyncFactory;
import cn.heilongjiang.ic.meeting.framework.web.service.TokenService;

/**
 * 自定义退出处理类 返回成功
 * 
 * @author hicms
 */
@Configuration
public class LogoutSuccessHandlerImpl implements LogoutSuccessHandler
{
    @Autowired
    private TokenService tokenService;

    /**
     * 退出处?
     * 
     * @return
     */
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException
    {
        LoginUser loginUser = tokenService.getLoginUser(request);
        if (StringUtils.isNotNull(loginUser))
        {
            String userName = loginUser.getUsername();
            // 删除用户缓存记录
            tokenService.delLoginUser(loginUser.getToken());
            // 记录用户退出日?
            AsyncManager.me().execute(AsyncFactory.recordLogininfor(userName, Constants.LOGOUT, MessageUtils.message("user.logout.success")));
        }
        ServletUtils.renderString(response, JSON.toJSONString(AjaxResult.success(MessageUtils.message("user.logout.success"))));
    }
}
