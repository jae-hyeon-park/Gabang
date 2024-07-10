package com.aboba.gabang.product.service;

import com.aboba.gabang.product.dto.ProductRequestDTO;
import com.aboba.gabang.product.dto.ProductResponseDTO;
import com.aboba.gabang.product.dto.ProductResponseMainDTO;
import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Image;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.CategoryRepository;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.product.service.ProductService;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@SpringBootTest
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;
    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    @InjectMocks
    private AddProductService addProductService;

    private ProductRequestDTO productRequestDTO;

    private Category category;
    private User seller;
    private Image image;
    private Product product1;
    private Product product2;

    @BeforeEach
    void setUp() {
        category = new Category(1, "전자기기");
        seller = User.builder()
                .userId("user1")
                .userPwd("password!")
                .userName("yunie")
                .userPhoneNumber("01012345678")
                .userBirthdate("19960605")
                .cdBankcode("01")
                .userAccount("123-456-789012")
                .joinDate(LocalDateTime.now())
                .updateDate(LocalDateTime.now())
                .ynInsurance(false)
                .ynSecession(false)
                .role("active")
                .suspensions(new ArrayList<>())
                .build();
        image = new Image(1, "https://search.pstatic.net/common/?src=https%3A%2F%2Fshopping-phinf.pstatic.net%2Fmain_3564624%2F35646241370.1.jpg&type=f372_372", null);

        product1 = new Product(1, "Description 1", 1000, category, seller, "Product 1", "1", "Seoul", false, false, "1", LocalDateTime.now(), LocalDateTime.now(), List.of(image), null);
        product2 = new Product(2, "Description 2", 2000, category, seller, "Product 2", "1", "Busan", false, false, "1", LocalDateTime.now(), LocalDateTime.now(), List.of(image), null);
    }

    @Test
    void testFindAllMain() {
        // Given
        List<Product> mockProducts = Arrays.asList(product1, product2);
        when(productRepository.findAllActive()).thenReturn(mockProducts);

        // When
        List<ProductResponseMainDTO> result = productService.findAllMain();

        // Then
        assertEquals(2, result.size());
        assertNotNull(result.get(0));
        assertNotNull(result.get(1));
        assertEquals("Product 1", result.get(0).getProductName());
        assertEquals("Product 2", result.get(1).getProductName());
    }

    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"a", "null", "undefined"})
    void findAll(String searchKeyword) {
        // Given
        int page = 0;
        int size = 5;
        PageRequest pageRequest = PageRequest.of(page, size);
        List<ProductResponseDTO> products = new ArrayList<>();

        products.add(new ProductResponseDTO(product1));
        products.add(new ProductResponseDTO(product2));

        // When
        if (searchKeyword == null || searchKeyword.equals("null") || searchKeyword.equals("undefined")) {
            when(productRepository.findAllByPage(pageRequest)).thenReturn(new PageImpl<>(products));
        } else {
            when(productRepository.findAllByProductNameContaining(searchKeyword, pageRequest)).thenReturn(new PageImpl<>(products));
        }

        Page<ProductResponseDTO> result = productService.findAll(searchKeyword, page, size);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals("Product 1", result.getContent().get(0).getProductName());
        assertEquals("Product 2", result.getContent().get(1).getProductName());
    }

    @Test
    void enrollProductTest(){
        productRequestDTO = new ProductRequestDTO(
                "Product 1", 1, 1000, "1", "Seoul", false, "Description 1", "user1"
        );

        when(userRepository.findById(productRequestDTO.getUserId())).thenReturn(Optional.of(seller));
        when(categoryRepository.findById(productRequestDTO.getCategoryId())).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product1);

        Product p = addProductService.createProduct(productRequestDTO);

        assertEquals(p, product1);
        assertEquals(p.getCategory(), category);
        assertEquals(p.getSeller(), seller);

    }

}
