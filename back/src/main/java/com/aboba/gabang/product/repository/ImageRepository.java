package com.aboba.gabang.product.repository;

import com.aboba.gabang.product.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Integer> {

    @Query("SELECT i FROM Image i WHERE i.product.id = :productId")
    List<Image> findImagesByProductId(@Param("productId") Integer productId);

    //s3삭제를 위함
    List<Image> findByProduct_ProductIdAndImgUrlIn(Integer productId, List<String> urls);
    void deleteByProduct_ProductIdAndImgUrlIn(Integer productId, List<String> urls);

}
