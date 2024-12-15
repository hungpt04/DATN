package com.example.da_be.repository;

import com.example.da_be.entity.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatLieuRepository extends JpaRepository<ChatLieu, Integer> {
    @Query(
            "SELECT cl FROM ChatLieu cl WHERE cl.trangThai = 1"
    )
    List<ChatLieu> getAllChatLieu();
}
