package com.example.da_be.controller;

import com.example.da_be.config.JwtTokenProvider;
import com.example.da_be.email.Email;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.exception.UserException;
import com.example.da_be.repository.TaiKhoanRepository;
import com.example.da_be.request.*;
import com.example.da_be.response.AuthResponse;
import com.example.da_be.service.AuthenticationService;
import com.example.da_be.service.CustomUserDetails;
import com.example.da_be.service.TaiKhoanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/auth")
public class AuthController {

//	private TaiKhoanRepository taiKhoanRepository;
//	private PasswordEncoder passwordEncoder;
//	private JwtTokenProvider jwtTokenProvider;
//	private CustomUserDetails customUserDetails;
//
//	public AuthController(TaiKhoanRepository taiKhoanRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, CustomUserDetails customUserDetails) {
//		this.taiKhoanRepository=taiKhoanRepository;
//		this.passwordEncoder=passwordEncoder;
//		this.jwtTokenProvider=jwtTokenProvider;
//		this.customUserDetails=customUserDetails;
//	}
//
//	@PostMapping("/signup")
//	public ResponseEntity<AuthResponse> createUserHandler(@Valid @RequestBody TaiKhoan user) throws UserException {
//
//		  	String email = user.getEmail();
//	        String password = user.getMatKhau();
//	        String fullName=user.getHoTen();
//	        String role=user.getVaiTro();
//
//	        TaiKhoan isEmailExist=taiKhoanRepository.findByEmail(email);
//
//	        // Check if user with the given email already exists
//	        if (isEmailExist!=null) {
//
//	            throw new UserException("Email Is Already Used With Another Account");
//	        }
//
//	        // Create new user
//			TaiKhoan createdUser= new TaiKhoan();
//			createdUser.setEmail(email);
//			createdUser.setHoTen(fullName);
//	        createdUser.setMatKhau(passwordEncoder.encode(password));
//	        createdUser.setVaiTro(role);
//
//	        TaiKhoan savedUser= taiKhoanRepository.save(createdUser);
//
//
//	        Authentication authentication = new UsernamePasswordAuthenticationToken(email, password);
//	        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//	        String token = jwtTokenProvider.generateToken(authentication);
//
//	        AuthResponse authResponse= new AuthResponse(token,true);
//
//	        return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.OK);
//
//	}
//
//	@PostMapping("/signin")
//    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest) {
//        String username = loginRequest.getEmail();
//        String password = loginRequest.getPassword();
//
//        System.out.println(username +" ----- "+password);
//
//        Authentication authentication = authenticate(username, password);
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//
//        String token = jwtTokenProvider.generateToken(authentication);
//        AuthResponse authResponse= new AuthResponse();
//
//		authResponse.setStatus(true);
//		authResponse.setJwt(token);
//
//        return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.OK);
//    }
//
//	private Authentication authenticate(String username, String password) {
//        UserDetails userDetails = customUserDetails.loadUserByUsername(username);
//
//        System.out.println("sign in userDetails - "+userDetails);
//
//        if (userDetails == null) {
//        	System.out.println("sign in userDetails - null " + userDetails);
//            throw new BadCredentialsException("Invalid username or password");
//        }
//        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
//        	System.out.println("sign in userDetails - password not match " + userDetails);
//            throw new BadCredentialsException("Invalid username or password");
//        }
//        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//    }


	@Autowired
	private AuthenticationService authenticationService;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Autowired
	private AuthenticationManager authenticationManager;

	// Đăng ký tài khoản mới
	@PostMapping("/signup")
	public ResponseEntity<TaiKhoan> registerUser(@RequestBody SignupRequest signupRequest) {
		TaiKhoan createdTaiKhoan = authenticationService.registerUser(signupRequest);
		return new ResponseEntity<>(createdTaiKhoan, HttpStatus.CREATED);
	}

	// Đăng nhập user
	@PostMapping("/signin")
	public ResponseEntity<String> authenticateUser (@RequestBody SigninRequest signinRequest) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(signinRequest.getEmail(), signinRequest.getMatKhau()));

			CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
			TaiKhoan taiKhoan = userDetails.getTaiKhoan();

			String jwt = jwtTokenProvider.generateToken(taiKhoan);
			return ResponseEntity.ok(jwt);
		} catch (AuthenticationException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Đăng nhập không thành công! " + e.getMessage());
		}
	}

	@GetMapping("/check-mail")
	public ResponseEntity<?> checkMail(@RequestParam String email) {
		Optional<TaiKhoan> taiKhoan = authenticationService.checkMail(email);
		if (taiKhoan != null) {
			return ResponseEntity.ok(taiKhoan);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email not found");
	}

	@GetMapping("/send-otp")
	public ResponseEntity<?> sendOTP(@RequestParam String email) {
		return new ResponseEntity<>(authenticationService.sendOTP(email), HttpStatus.OK);
	}

	@PostMapping("/forgot-password")
	public ResponseEntity<?> change(@RequestBody ForgotPasswordRequest request) {
		return new ResponseEntity<>(authenticationService.change(request), HttpStatus.OK);
	}

	@GetMapping("/check-pass")
	public ResponseEntity<?> checkPassword(
			@RequestParam String currentPassword,
			Principal principal
	) {
		try {
			// Lấy email của user đang đăng nhập
			String email = principal.getName();

			// Gọi service để kiểm tra mật khẩu
			boolean isPasswordCorrect = authenticationService.checkPassword(email, currentPassword);

			return ResponseEntity.ok(isPasswordCorrect);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kiểm tra mật khẩu thất bại: " + e.getMessage());
		}
	}
//	public ResponseEntity<String> checkPassword(@RequestParam String email, @RequestParam String currentPassword) {
//		try {
//			// Gọi service để kiểm tra mật khẩu
//			boolean isPasswordCorrect = authenticationService.checkPassword(email, currentPassword);
//			if (isPasswordCorrect) {
//				return ResponseEntity.ok("Mật khẩu chính xác!");
//			} else {
//				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Mật khẩu không chính xác!");
//			}
//		} catch (RuntimeException e) {
//			// Xử lý nếu email không tồn tại
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//		}
//	}

}
