package com.nhh203.productservice.repository;


import com.nhh203.productservice.model.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Page<Category> findAll(Pageable pageable);

    Page<Category> findByCategoryTitleContaining(String categoryTitle, Pageable pageable);
}
