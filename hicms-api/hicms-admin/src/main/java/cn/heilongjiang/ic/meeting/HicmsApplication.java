package cn.heilongjiang.ic.meeting;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 启动程序
 * 
 * @author hicms
 */
@EnableScheduling
@SpringBootApplication(exclude = { DataSourceAutoConfiguration.class })
public class HicmsApplication
{
    public static void main(String[] args)
    {
        // System.setProperty("spring.devtools.restart.enabled", "false");
        SpringApplication.run(HicmsApplication.class, args);
        System.out.println("(♥◠‿◠)ﾉﾞ  龙信会管启动成功   ლ(´ڡ`ლ)ﾞ  \n" +
                " _      __  __\n" +
                " | |     \\ \\/ /\n" +
                " | |      \\  /\n" +
                " | |      /  \\\n" +
                " | |____ / /\\ \\\n" +
                " |______/_/  \\_\\              ");
    }
}
