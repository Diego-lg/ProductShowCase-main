import TshirtShowcase from "./TshirtShowcase";
import "./ShowCase.css";
import styled from "styled-components";
import React, { useState } from "react";

const queryParams = new URLSearchParams(window.location.search);
const imageUrl = queryParams.get("image") || "xamples/014.png"; // Fallback image

const ShowcaseContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;
const ProductImage = styled.img`
  width: 40%;
  height: auto;
  margin-right: 60px;
  margin-top: 20px;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const ProductDetails = styled.div`
  width: 50%;
  margin-top: 20px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ProductName = styled.h2`
  font-size: 28px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ProductPrice = styled.p`
  font-size: 20px;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const ProductDescription = styled.p`
  margin-bottom: 30px;
  line-height: 1.6;
`;

const SizeSelector = styled.div`
  margin-bottom: 30px;
`;

const SizeBubbleContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap; /* Allow wrapping of size options */
`;

const SizeBubble = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 50px;
  background-color: black;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &.selected {
    background-color: #007bff;
    border-color: #007bff;
  }

  &:hover,
  &:focus {
    background-color: #007bff;
    border-color: #007bff;
  }
`;

const AddToCartButton = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.2s;

  &:hover,
  &:focus {
    background-color: #0056b3;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    padding: 10px 20px;
  }
`;

const EnhancedTshirtShowcase = styled.div`
  background-image: url(${(props) => props.imageUrl});
  background-color: #ffffff;
  padding: 3%;
  border: 1px solid #ddd;
  border-radius: 15px;
  margin-top: 0px;
  width: 40vw;
  height: 40vw;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100vw;
  }

  @media (max-width: 480px) {
    padding: 10px;
    margin-top: 20px;
    width: 100%;
  }
`;

const ShowCase = () => {
  const product = {
    id: 1,
    name: "Stylish T-Shirt",
    price: 30,
    description:
      "This is a high-quality t-shirt with a modern design. The soft and breathable fabric ensures all-day comfort. Available in multiple sizes to fit your style.",
    image: "xamples/014.png",
    sizes: ["S", "M", "L", "XL"],
  };

  const [selectedSize, setSelectedSize] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const imageUrl = queryParams.get("image") || product.image; // Use product image as fallback

  return (
    <ShowcaseContainer className="font-code transition-colors   ">
      <EnhancedTshirtShowcase imageUrl={imageUrl}>
        <TshirtShowcase />
      </EnhancedTshirtShowcase>
    </ShowcaseContainer>
  );
};

export default ShowCase;
