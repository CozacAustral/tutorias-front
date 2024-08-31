"use client";
import React from "react";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onFirstPage: () => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onFirstPage,
  onPrevPage,
  onNextPage,
  onLastPage,
}) => {
  return (
    <HStack spacing={4} mt={4} justifyContent="center" alignItems={"center"}>
      <IconButton
        onClick={onFirstPage}
        disabled={currentPage === 1}
        icon={<ArrowLeftIcon />}
        aria-label="First Page"
        backgroundColor={"white"}
        _hover={{
          borderRadius: 15,
          backgroundColor: "#318AE4",
          color: "white",
        }}
      />
      <IconButton
        onClick={onPrevPage}
        disabled={currentPage === 1}
        icon={<ChevronLeftIcon />}
        aria-label="Previous Page"
        backgroundColor={"white"}
        _hover={{
          borderRadius: 15,
          backgroundColor: "#318AE4",
          color: "white",
        }}
      />
      <Text>
        Página {currentPage} / {totalPages}
      </Text>
      <IconButton
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        icon={<ChevronRightIcon />}
        aria-label="Next Page"
        backgroundColor={"white"}
        _hover={{
          borderRadius: 15,
          backgroundColor: "#318AE4",
          color: "white",
        }}
      />
      <IconButton
        onClick={onLastPage}
        disabled={currentPage === totalPages}
        icon={<ArrowRightIcon />}
        aria-label="Last Page"
        backgroundColor={"white"}
        _hover={{
          borderRadius: 15,
          backgroundColor: "#318AE4",
          color: "white",
        }}
      />
    </HStack>
  );
};

export default Pagination;
