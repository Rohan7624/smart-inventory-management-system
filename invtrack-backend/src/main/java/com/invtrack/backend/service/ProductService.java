package com.invtrack.backend.service;

import com.invtrack.backend.dto.ProductRequest;
import com.invtrack.backend.dto.ProductResponse;
import com.invtrack.backend.entity.Product;
import com.invtrack.backend.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // CREATE
    public ProductResponse createProduct(ProductRequest request) {

        if (request.getSku() != null &&
                !request.getSku().isBlank() &&
                productRepository.existsBySku(request.getSku())) {

            throw new RuntimeException("SKU already exists");
        }

        Product product = new Product();

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setBrand(request.getBrand());
        product.setModel(request.getModel());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());
        product.setSpecifications(request.getSpecifications());

        Product savedProduct = productRepository.save(product);

        return convertToResponse(savedProduct);
    }

    // BULK CREATE
    public List<ProductResponse> createProductsBulk(
            List<ProductRequest> requests) {

        List<Product> products = requests.stream()
                .map(request -> {

                    // Check SKU already exists in database
                    if (request.getSku() != null &&
                            !request.getSku().isBlank() &&
                            productRepository.existsBySku(request.getSku())) {

                        throw new RuntimeException(
                                "SKU already exists: " + request.getSku()
                        );
                    }

                    Product product = new Product();

                    product.setName(request.getName());
                    product.setSku(request.getSku());
                    product.setBrand(request.getBrand());
                    product.setModel(request.getModel());
                    product.setPrice(request.getPrice());
                    product.setQuantity(request.getQuantity());
                    product.setCategory(request.getCategory());
                    product.setSpecifications(request.getSpecifications());

                    return product;
                })
                .toList();

        List<Product> savedProducts =
                productRepository.saveAll(products);

        return savedProducts.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // GET ALL
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // GET BY ID
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with ID: " + id)
                );

        return convertToResponse(product);
    }

    // SEARCH BY NAME
    public List<ProductResponse> searchProducts(String name) {

        return productRepository
                .findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // UPDATE
    public ProductResponse updateProduct(
            Long id,
            ProductRequest request) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with ID: " + id)
                );

        if (request.getSku() != null &&
                !request.getSku().isBlank()) {

            productRepository.findBySku(request.getSku())
                    .ifPresent(existingProduct -> {

                        if (!existingProduct.getId().equals(id)) {
                            throw new RuntimeException("SKU already exists");
                        }
                    });
        }

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setBrand(request.getBrand());
        product.setModel(request.getModel());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(request.getCategory());
        product.setSpecifications(request.getSpecifications());

        Product updatedProduct =
                productRepository.save(product);

        return convertToResponse(updatedProduct);
    }

    // DELETE
    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new RuntimeException(
                    "Product not found with ID: " + id
            );
        }

        productRepository.deleteById(id);
    }

    private ProductResponse convertToResponse(Product product) {

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getBrand(),
                product.getModel(),
                product.getPrice(),
                product.getQuantity(),
                product.getCategory(),
                product.getSpecifications()
        );
    }
}