import { StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { color } from "./colors";

export const DropDown = ({
  options,
  placeholder,
  search = undefined,
  setValue,
}) => {
  return (
    <SelectDropdown
      data={options}
      onSelect={(selectedItem) => {
        setValue(selectedItem.value);
      }}
      search={search}
      searchInputTxtColor={color.green}
      searchPlaceHolder={search ? "Search" : ""}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {selectedItem ? selectedItem.label : placeholder || "Select"}
            </Text>
            <Icon
              name={isOpened ? "chevron-up" : "chevron-down"}
              style={styles.dropdownButtonArrowStyle}
            />
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && { backgroundColor: "#D2D9DF" }),
            }}
          >
            <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    maxWidth: 200,
    minWidth: 100,
    height: 35,
    backgroundColor: "#E9ECEF",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexWrap: "nowrap",
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    textAlign: "left",
  },
  dropdownButtonArrowStyle: {
    fontSize: 22,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D2D9DF",
  },
  dropdownItemStyle: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#D2D9DF",
  },
  dropdownItemTxtStyle: {
    fontSize: 15,
    color: "#151E26",
  },
});
