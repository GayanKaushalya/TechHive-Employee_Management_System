import java.security.SecureRandom;
import java.util.Base64;

// This is a temporary class. You can delete it after running it once.
public class KeyGenerator {

    public static void main(String[] args) {
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[64]; // Using 64 bytes (512 bits) for a very strong key
        random.nextBytes(keyBytes);
        String secretKey = Base64.getEncoder().encodeToString(keyBytes);

        System.out.println("----- GENERATED JWT SECRET KEY -----");
        System.out.println(secretKey);
        System.out.println("------------------------------------");
    }
}