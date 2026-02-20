package jar;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class Autopay {

    @Scheduled(fixedRate = 5000)  
    public void pay() {

        System.out.println("Running auto-pay scheduler...");
    }

    @Scheduled(cron = "5 * * * * ?")
    public void pay2() {
        System.out.println("Running daily auto-pay scheduler...");
    }
}