import {
  HStack,
  IconButton,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Input,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getPageNumbers: () => (number | "...")[];
  onPageChange: (page: number) => void;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  inputPage: number;
  setInputPage: (n: number) => void;
  pageSize: number;
  total: number;
  from: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  getPageNumbers,
  onPageChange,
  canPrev,
  canNext,
  onPrev,
  onNext,
  inputPage,
  setInputPage,
  pageSize,
  total,
  from,
}) => (
  <Flex justify="center" align="center" mt="6" direction="column" gap="2">
    <HStack spacing={1}>
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={onPrev}
        isDisabled={!canPrev}
        aria-label="Previous"
      />
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <Popover placement="top" key={`ellipsis-${idx}`}>
            <PopoverTrigger>
              <Button variant="ghost" size="sm">
                …
              </Button>
            </PopoverTrigger>
            <PopoverContent w="fit-content">
              <PopoverArrow />
              <PopoverBody>
                <HStack spacing={2}>
                  <Input
                    size="sm"
                    type="number"
                    value={inputPage}
                    min={1}
                    max={totalPages}
                    onChange={(e) => setInputPage(parseInt(e.target.value))}
                    w="80px"
                  />
                  <Button
                    size="sm"
                    colorScheme="brand"
                    onClick={() => {
                      const page = Math.max(1, Math.min(totalPages, inputPage));
                      onPageChange(page);
                    }}
                  >
                    Go
                  </Button>
                </HStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          <Button
            key={page}
            colorScheme={page === currentPage ? "brand" : "gray"}
            variant={page === currentPage ? "solid" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      )}
      <IconButton
        icon={<ChevronRightIcon />}
        onClick={onNext}
        isDisabled={!canNext}
        aria-label="Next"
      />
    </HStack>
    <Text fontSize="sm" color="gray.600" whiteSpace="nowrap" mt="2">
      Showing{" "}
      <b>
        {from + 1}–{Math.min(from + pageSize, total)}
      </b>{" "}
      of <b>{total}</b> results
    </Text>
  </Flex>
);

export default Pagination;
