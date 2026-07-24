package cn.heilongjiang.ic.meeting.meeting.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import cn.heilongjiang.ic.meeting.common.constant.CacheConstants;
import cn.heilongjiang.ic.meeting.common.core.controller.BaseController;
import cn.heilongjiang.ic.meeting.common.core.domain.AjaxResult;
import cn.heilongjiang.ic.meeting.common.core.domain.entity.SysUser;
import cn.heilongjiang.ic.meeting.common.core.domain.model.LoginUser;
import cn.heilongjiang.ic.meeting.common.core.page.TableDataInfo;
import cn.heilongjiang.ic.meeting.common.core.redis.RedisCache;
import cn.heilongjiang.ic.meeting.common.utils.StringUtils;
import cn.heilongjiang.ic.meeting.system.domain.SysUserOnline;
import cn.heilongjiang.ic.meeting.system.service.ISysUserOnlineService;

/**
 * 在线用户管理（仅 user_type=00 的管理员可操作）
 *
 * @author hicms
 */
@RestController
@RequestMapping("/admin/online")
public class SysUserOnlineManageController extends BaseController
{
    @Autowired
    private ISysUserOnlineService userOnlineService;

    @Autowired
    private RedisCache redisCache;

    /**
     * 校验当前用户是否为管理员（user_type = "00"）
     */
    private boolean isAdmin()
    {
        SysUser currentUser = getLoginUser().getUser();
        return "00".equals(currentUser.getUserType());
    }

    /**
     * 查询在线用户列表
     */
    @GetMapping("/list")
    public TableDataInfo list(String ipaddr, String userName)
    {
        if (!isAdmin())
        {
            TableDataInfo rspData = new TableDataInfo();
            rspData.setCode(500);
            rspData.setMsg("无管理权限");
            return rspData;
        }

        Collection<String> keys = redisCache.keys(CacheConstants.LOGIN_TOKEN_KEY + "*");
        List<SysUserOnline> userOnlineList = new ArrayList<>();
        for (String key : keys)
        {
            LoginUser user = redisCache.getCacheObject(key);
            if (StringUtils.isNotEmpty(ipaddr) && StringUtils.isNotEmpty(userName))
            {
                userOnlineList.add(userOnlineService.selectOnlineByInfo(ipaddr, userName, user));
            }
            else if (StringUtils.isNotEmpty(ipaddr))
            {
                userOnlineList.add(userOnlineService.selectOnlineByIpaddr(ipaddr, user));
            }
            else if (StringUtils.isNotEmpty(userName) && StringUtils.isNotNull(user.getUser()))
            {
                userOnlineList.add(userOnlineService.selectOnlineByUserName(userName, user));
            }
            else
            {
                userOnlineList.add(userOnlineService.loginUserToUserOnline(user));
            }
        }
        Collections.reverse(userOnlineList);
        userOnlineList.removeAll(Collections.singleton(null));
        return getDataTable(userOnlineList);
    }

    /**
     * 强退用户
     */
    @DeleteMapping("/{tokenId}")
    public AjaxResult forceLogout(@PathVariable String tokenId)
    {
        if (!isAdmin())
        {
            return AjaxResult.error("无管理权限");
        }
        redisCache.deleteObject(CacheConstants.LOGIN_TOKEN_KEY + tokenId);
        return success();
    }
}
