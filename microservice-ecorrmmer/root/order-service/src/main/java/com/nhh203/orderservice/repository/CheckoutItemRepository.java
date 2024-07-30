package com.nhh203.orderservice.repository;
import com.nhh203.orderservice.model.CheckoutItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface CheckoutItemRepository extends JpaRepository<CheckoutItem, Long> {
}
