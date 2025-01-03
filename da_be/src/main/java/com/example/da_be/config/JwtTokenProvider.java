package com.example.da_be.config;

import com.example.da_be.entity.TaiKhoan;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class JwtTokenProvider {

	private SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

	public String generateToken(TaiKhoan taiKhoan) {
		String vaiTro = taiKhoan.getVaiTro();

		// Tạo jwt
		String jwt = Jwts.builder()
				.setIssuedAt(new Date())
				.setExpiration(new Date(new Date().getTime() + 7 * 86400000))
				.claim("email", taiKhoan.getEmail())
				.claim("authorities", vaiTro)
				.signWith(key)
				.compact();
		
		return jwt;	
	}
	
//	public String getEmailFromJwtToken(String jwt) {
//		jwt=jwt.substring(7);
//
//		Claims claims=Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
//		String email=String.valueOf(claims.get("email"));
//
//		return email;
//	}
//
//	public String populateAuthorities(Collection<? extends GrantedAuthority> collection) {
//		Set<String> auths=new HashSet<>();
//
//		for(GrantedAuthority authority:collection) {
//			auths.add(authority.getAuthority());
//		}
//		return String.join(",",auths);
//	}

	public String getEmailFromJwtToken(String jwt) {
		if (jwt.startsWith("Bearer ")) {
			jwt = jwt.substring(7);
		}

		try {
			Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
			return String.valueOf(claims.get("email"));
		} catch (io.jsonwebtoken.ExpiredJwtException e) {
			throw new RuntimeException("Token đã hết hạn: " + e.getMessage());
		} catch (io.jsonwebtoken.SignatureException e) {
			throw new RuntimeException("Chữ ký token không hợp lệ: " + e.getMessage());
		} catch (Exception e) {
			throw new RuntimeException("Token không hợp lệ: " + e.getMessage());
		}
	}

}
