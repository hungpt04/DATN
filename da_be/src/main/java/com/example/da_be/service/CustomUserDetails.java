package com.example.da_be.service;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.repository.TaiKhoanRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CustomUserDetails extends User implements UserDetails {
	
//	private TaiKhoanRepository taiKhoanRepository;
//
//	public CustomUserDetails(TaiKhoanRepository taiKhoanRepository) {
//		this.taiKhoanRepository=taiKhoanRepository;
//
//	}
//
//	@Override
//	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//
//		TaiKhoan user = taiKhoanRepository.findByEmail(username);
//
//		if(user == null) {
//			throw new UsernameNotFoundException("user not found with email "+username);
//		}
//
//		List<GrantedAuthority> authorities = new ArrayList<>();
//
//		return new org.springframework.security.core.userdetails.User(user.getEmail(),user.getMatKhau(),authorities);
//	}

	public TaiKhoan taiKhoan;

	public CustomUserDetails(TaiKhoan taiKhoan) {
		super(taiKhoan.getEmail(), taiKhoan.getMatKhau(), Collections.emptyList());
		this.taiKhoan = taiKhoan;
	}

	public TaiKhoan getTaiKhoan() {
		return taiKhoan;
	}

//	public Integer getId() {
//		return taiKhoan.getId(); // Giả sử TaiKhoan có phương thức getId()
//	}

}
