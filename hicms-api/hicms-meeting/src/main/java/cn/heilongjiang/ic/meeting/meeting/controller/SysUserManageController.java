package cn.heilongjiang.ic.meeting.meeting.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import cn.heilongjiang.ic.meeting.common.core.controller.BaseController;
import cn.heilongjiang.ic.meeting.common.core.domain.AjaxResult;
import cn.heilongjiang.ic.meeting.common.core.domain.entity.SysUser;
import cn.heilongjiang.ic.meeting.common.core.page.TableDataInfo;
import cn.heilongjiang.ic.meeting.common.utils.SecurityUtils;
import cn.heilongjiang.ic.meeting.system.service.ISysUserService;

/**
 * 系统用户管理（仅 user_type=00 的管理员可操作）
 *
 * @author hicms
 */
@RestController
@RequestMapping("/admin/user")
public class SysUserManageController extends BaseController
{
    @Autowired
    private ISysUserService userService;

    /**
     * 校验当前用户是否为管理员（user_type = "00"）
     */
    private boolean isAdmin()
    {
        SysUser currentUser = getLoginUser().getUser();
        return "00".equals(currentUser.getUserType());
    }

    /**
     * 查询用户列表（分页+条件）
     */
    @GetMapping("/list")
    public TableDataInfo list(SysUser user)
    {
        if (!isAdmin())
        {
            TableDataInfo rspData = new TableDataInfo();
            rspData.setCode(500);
            rspData.setMsg("无管理权限");
            return rspData;
        }
        startPage();
        List<SysUser> list = userService.selectUserList(user);
        return getDataTable(list);
    }

    /**
     * 根据用户编号获取详细信息
     */
    @GetMapping("/{userId}")
    public AjaxResult getInfo(@PathVariable Long userId)
    {
        if (!isAdmin())
        {
            return AjaxResult.error("无管理权限");
        }
        return success(userService.selectUserById(userId));
    }

    /**
     * 新增用户
     */
    @PostMapping
    public AjaxResult add(@RequestBody SysUser user)
    {
        if (!isAdmin())
        {
            return AjaxResult.error("无管理权限");
        }
        user.setCreateBy(getUsername());
        user.setPassword(SecurityUtils.encryptPassword(user.getPassword()));
        return toAjax(userService.insertUser(user));
    }

    /**
     * 修改用户
     */
    @PutMapping
    public AjaxResult edit(@RequestBody SysUser user)
    {
        if (!isAdmin())
        {
            return AjaxResult.error("无管理权限");
        }
        user.setUpdateBy(getUsername());
        return toAjax(userService.updateUser(user));
    }

    /**
     * 删除用户（支持批量）
     */
    @DeleteMapping("/{userIds}")
    public AjaxResult remove(@PathVariable Long[] userIds)
    {
        if (!isAdmin())
        {
            return AjaxResult.error("无管理权限");
        }
        return toAjax(userService.deleteUserByIds(userIds));
    }
}
