import org.springframework.context.annotation.Bean;

@Bean
public org.springframework.web.client.RestTemplate restTemplate() {
    return new org.springframework.web.client.RestTemplate();
}

public void main() {
}

