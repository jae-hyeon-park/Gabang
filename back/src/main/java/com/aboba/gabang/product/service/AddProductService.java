package com.aboba.gabang.product.service;

import com.aboba.gabang.product.dto.ProductRequestDTO;
import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Image;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.CategoryRepository;
import com.aboba.gabang.product.repository.ImageRepository;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;

    public Product createProduct(ProductRequestDTO productDTO){

        Optional<User> optional= userRepository.findById(productDTO.getUserId());
        Optional<Category> optional2= categoryRepository.findById(productDTO.getCategoryId());

        if(optional.isEmpty() || optional2.isEmpty()){ //가진 값이 없는 경우
            return null;
        }
        else{
            User user = optional.get();
            Category category = optional2.get();
            Product p = productRepository.save(productDTO.toEntity(user, category));

            return p;
        }

    }

    public void addImage(List<String> imageURLs, Product product){

       for(String url : imageURLs){
           try {
               imageRepository.save(Image.builder().imgUrl(url).product(product).build());
           } catch (Exception e) {
               e.printStackTrace();
           }
       }

    }
}
