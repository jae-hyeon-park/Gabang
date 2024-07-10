package com.aboba.gabang.product.repository;

import com.aboba.gabang.product.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
