import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

/**
 * Props for the SortMenu component.
 * Controls sorting options for the dog list.
 */
interface SortMenuProps {
  sortBy: "breed" | "name" | "age" | "location";
  setSortBy: (s: "breed" | "name" | "age" | "location") => void;
  sortDir: "asc" | "desc";
  setSortDir: (d: "asc" | "desc") => void;
}

/**
 * SortMenu component provides a dropdown menu for selecting sort field and direction.
 */
const SortMenu: React.FC<SortMenuProps> = ({
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
}) => (
  <Menu>
    <MenuButton
      as={Button}
      variant="outline"
      colorScheme="accent"
      rightIcon={
        <Icon
          as={
            sortDir === "asc"
              ? (FaCaretUp as React.ElementType)
              : (FaCaretDown as React.ElementType)
          }
          boxSize={5}
        />
      }
    >
      Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
    </MenuButton>
    <MenuList bg="white">
      {/* Sort direction group */}
      <MenuOptionGroup defaultValue={sortDir} title="Order" type="radio">
        <MenuItemOption value="asc" onClick={() => setSortDir("asc")}>
          Ascending
        </MenuItemOption>
        <MenuItemOption value="desc" onClick={() => setSortDir("desc")}>
          Descending
        </MenuItemOption>
      </MenuOptionGroup>
      <MenuDivider />
      {/* Sort field group */}
      <MenuOptionGroup defaultValue={sortBy} title="Sort By" type="radio">
        <MenuItemOption value="breed" onClick={() => setSortBy("breed")}>
          Breed
        </MenuItemOption>
        <MenuItemOption value="name" onClick={() => setSortBy("name")}>
          Name
        </MenuItemOption>
        <MenuItemOption value="age" onClick={() => setSortBy("age")}>
          Age
        </MenuItemOption>
      </MenuOptionGroup>
    </MenuList>
  </Menu>
);

export default SortMenu;
