package org.example.springecom.service;

import org.example.springecom.model.Product;
import org.example.springecom.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo productRepo;

    public  List<Product> getAllProduct() {
        return productRepo.findAll();
    }

    public Product getProductById(int id) {
        return productRepo.findById(id).orElse(null);
    }

    public Product addOrUpdateProduct(Product product, MultipartFile image) throws IOException {
        product.setImageName(image.getOriginalFilename());
        product.setImageType(image.getContentType());
        product.setImageData(image.getBytes());

        return productRepo.save(product);
    }

    public Product getImageByProductId(int productId) {
        return productRepo.findById(productId).orElse(null);
    }

    public void deleteProduct(int id) {
        productRepo.deleteById(id);
    }

    public List<Product> searchProduct(String keyword) {
        return productRepo.searchProduct(keyword);
    }

//    public Product updateProduct(Product product, MultipartFile imageFile) throws IOException {
//        product.setImageName(imageFile.getOriginalFilename());
//        product.setImageType(imageFile.getContentType());
//        product.setImageData(imageFile.getBytes());
//
//        return productRepo.save(product);
//    }
}
