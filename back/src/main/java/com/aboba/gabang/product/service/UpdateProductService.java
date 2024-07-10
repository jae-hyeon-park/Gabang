package com.aboba.gabang.product.service;

import com.aboba.gabang.product.dto.ProductRequestUpdateDTO;
import com.aboba.gabang.product.model.Category;
import com.aboba.gabang.product.model.Product;
import com.aboba.gabang.product.repository.CategoryRepository;
import com.aboba.gabang.product.repository.ImageRepository;
import com.aboba.gabang.product.repository.ProductRepository;
import com.aboba.gabang.user.model.User;
import com.aboba.gabang.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UpdateProductService {

    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    @Transactional
    public Product updateProduct(ProductRequestUpdateDTO updateDTO){
        Optional<Product> opt = productRepository.findById(updateDTO.getProductId());
        Optional<Category> opt2 = categoryRepository.findById(updateDTO.getCategoryId());
        Optional<User> opt3 = userRepository.findById(updateDTO.getUserId());

        Product newP = updateDTO.setEntity(opt.get(), updateDTO, opt2.get());
        productRepository.save(newP);

        deleteProductImages(updateDTO.getProductId(), updateDTO.getDeleteImageURLs());

        return newP;
    }

    @Transactional
    private void deleteProductImages(Integer productId, List<String> urlsToDelete) {
        // S3에서 이미지 파일 삭제
        urlsToDelete.forEach(url -> {
            s3Service.deleteFileFromS3Bucket(url);
        });

        // 데이터베이스에서 이미지 메타데이터 삭제
        imageRepository.deleteByProduct_ProductIdAndImgUrlIn(productId, urlsToDelete);
    }
}
