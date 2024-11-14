package com.example.da_be.service;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.repository.TaiKhoanRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetails implements UserDetailsService {
	
	private TaiKhoanRepository taiKhoanRepository;
	
	public CustomUserDetails(TaiKhoanRepository taiKhoanRepository) {
		this.taiKhoanRepository=taiKhoanRepository;
		
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		TaiKhoan user = taiKhoanRepository.findByEmail(username);
		
		if(user == null) {
			throw new UsernameNotFoundException("user not found with email "+username);
		}
		
		List<GrantedAuthority> authorities = new ArrayList<>();
		
		return new org.springframework.security.core.userdetails.User(user.getEmail(),user.getMatKhau(),authorities);
	}

}
