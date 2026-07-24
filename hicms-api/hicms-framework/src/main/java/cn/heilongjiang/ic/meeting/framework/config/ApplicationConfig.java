package cn.heilongjiang.ic.meeting.framework.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * 程序注解配置
 *
 * @author hicms
 */
@Configuration
// 表示通过aop框架暴露该代理对?AopContext能够访问
@EnableAspectJAutoProxy(exposeProxy = true)
// 指定要扫描的Mapper类的包的路径
@MapperScan("cn.heilongjiang.ic.meeting.**.mapper")
public class ApplicationConfig
{
}
