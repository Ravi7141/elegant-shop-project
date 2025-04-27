package org.example.springecom.Controller;

import org.example.springecom.model.Product;
import org.example.springecom.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;

    @RequestMapping("/products")
    public List<Product> products() {
        return productService.getAllProduct();
    }

    @RequestMapping("/product/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if(product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product, @RequestPart MultipartFile imageFile) {
        Product product1 = null;
        try {
            product1 = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>(product1,HttpStatus.CREATED); // 201
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }

    }

    @GetMapping("product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId) {
        Product product =  productService.getImageByProductId(productId);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404
        }
        return new ResponseEntity<>(product.getImageData(), HttpStatus.OK); // 200
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestPart Product product, @RequestPart MultipartFile imageFile) {
        Product product1 = null;
        try {
            product1 = productService.addOrUpdateProduct(product, imageFile);
            return new ResponseEntity<>("Updated",HttpStatus.OK); // 200
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR); // 500
        }
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        Product product = productService.getProductById(id);
        if(product == null) {
            return new ResponseEntity<>("Product not found",HttpStatus.NOT_FOUND); // 404
        }
        productService.deleteProduct(id);
        return new ResponseEntity<>("Deleted",HttpStatus.OK); // 200
    }

    @GetMapping("products/search")
    public ResponseEntity<List<Product>> searchProduct(@RequestParam String keyword) {
        List<Product> products = productService.searchProduct(keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

}
