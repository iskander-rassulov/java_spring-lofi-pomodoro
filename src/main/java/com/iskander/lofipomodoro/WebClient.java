import org.springframework.context.annotation.Bean;

@Bean
public WebClient webClient(WebClient.Builder builder) {
    return builder.build();
}

public void main() {
}

