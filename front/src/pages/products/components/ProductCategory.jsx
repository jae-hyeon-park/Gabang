import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import categories from './category';

const ProductCategory = ({ productDetail }) => {
  function getNameById(id) {
    return Object.keys(categories).find((key) => categories[key] === id);
  }

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = productDetail?.category?.categoryId || parseInt(queryParams.get('category'), 10) || 0;

  const getCategoryHref = () => {
    if (category === 0) {
      return '/products';
    }
    return `/products?category=${category}`;
  };

  return (
    <Box ml={4}>
      <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray" />}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">홈</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={getCategoryHref()}>{getNameById(category)}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  );
};

export default ProductCategory;
