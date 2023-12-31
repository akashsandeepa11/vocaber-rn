import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import Modal from "react-native-modal";
import AddCategoryModal from "./AddCategoryModal";
import { selectCategory } from "../store/reducers/CategorySlice";
import { useDispatch, useSelector } from "react-redux";
import { addVocabulary, selectVocab } from "../store/reducers/VocabSlice";
import LanguageSelectorModal from "./LanguageSelectorModal";

export default function AddWordModal({ setModalVisible, isModalVisible }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sin, setSin] = useState("");
  const [def, setDef] = useState(null);
  const [userId, setUserId] = useState("0002");
  const [language1, setLanguage1] = useState({ id: 2, name: "sinhala" });
  const [language1Input, setLanguage1Input] = useState("");
  const [language2, setLanguage2] = useState({ id: 1, name: "english" });
  const [language2Input, setLanguage2Input] = useState("");
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  // console.log(today);

  const Category = useSelector(selectCategory);
  const Vocab = useSelector(selectVocab);
  const vocabReverse = [...Vocab.data];
  vocabReverse.reverse();

  // console.log( parseFloat(vocabReverse[vocabReverse.length - 1].id));

  const Categories = Category.data;

  const data = Categories.map((category, index) => ({
    key: index + 1,
    value: category.name,
  }));

  // const data = [
  //   {
  //     key: 1,
  //     value: "dsajh",
  //   },
  //   {
  //     key: 2,
  //     value: "adgf",
  //   },
  //   {
  //     key: 3,
  //     value: "sdgf",
  //   },
  // ];

  // console.log("data", data);

  // Modal visible
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const dispatch = useDispatch();

  const addVocabFunc = () => {
    dispatch(
      addVocabulary({
        id: parseFloat(vocabReverse[vocabReverse.length - 1].id) + 1,
        userId: userId,
        sin: language1Input,
        eng: language2Input,
        date: formattedDate,
        category: selectedCategory,
        def: def,
        save: false,
      })
    );
    setModalVisible(!isModalVisible);
    // console.log({
    //   id: nanoid(),
    //   language1Input: language1Input,
    //   sin: sin,
    //   date: today,
    //   category: selectedCategory,
    //   def: def,
    //   save: false,
    // });
  };

  // Modal visible functions
  const toggleModalCategory = () => {
    setCategoryModalVisible(!isCategoryModalVisible);
  };
  const toggleModalLanguage = () => {
    setLanguageModalVisible(!isLanguageModalVisible);
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={() => setModalVisible(false)}
    >
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <KeyboardAvoidingView className=" bg-white pt-3 rounded-[24px]">
        <ScrollView>
          <Text className="text-lg px-5 pb-2 font-semibold">
            Add a new word
          </Text>
          <View className="flex-row justify-evenly items-center">
            <Pressable
              onPress={() => toggleModalLanguage()}
              className=" active:bg-[#ffffff] items-center bg-[#f0f0f0] w-[130px] p-4 rounded-[24px]"
            >
              <Text>{language1.name}</Text>
            </Pressable>

            <Entypo name="swap" size={24} color="black" />
            <Pressable className=" items-center bg-[#f0f0f0] w-[130px] p-4 rounded-[24px]">
              <Text>{language2.name}</Text>
            </Pressable>
          </View>

          <View className="p-4">
            <View className="border border-gray-500 p-3 rounded-[24px] mt-3">
              <TextInput
                placeholder="Sinhala Word"
                onChangeText={(text) => setLanguage1Input(text)}
              />
            </View>
            <View className="border flex-row items-center justify-between border-gray-500 p-3 rounded-[24px]  mt-3">
              <TextInput
                onChangeText={(text) => setLanguage2Input(text)}
                placeholder="English Meaning"
                style={{ width: 220 }}
              />
              <Pressable onPress={() => console.log("Translate")}>
                <Text className="text-[16px] font-semibold text-[#1e6aca] ">
                  Translate
                </Text>
              </Pressable>
            </View>

            <Text className=" text-[16px] my-3 font-medium">
              Select Category
            </Text>

            <SelectList
              setSelected={(val) => setSelectedCategory(val)}
              data={data}
              save="value"
              // onSelect={() => {
              //   selectedCategory == "Add Category" && toggleModal();
              // }}
            />

            <View className="border border-gray-500 p-3 rounded-[24px]  mt-3">
              <TextInput
                onChangeText={(text) => setDef(text)}
                textAlignVertical="top"
                textAlign="left"
                placeholder="Definition"
                multiline={true}
                numberOfLines={5}
              />
            </View>
            <View className="flex-row">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-white border border-gray-500 items-center justify-center p-4 mt-4 rounded-[24px] mr-4"
              >
                <Text className="text-Black text-[14px] ">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => addVocabFunc()}
                className="flex-1 bg-[#1e6aca] items-center justify-center p-4 mt-4 rounded-[24px]"
              >
                <Text className="text-white text-[14px] ">Add Word</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AddCategoryModal
        isModalVisible={isCategoryModalVisible}
        toggleModal={toggleModalCategory}
      />

      {/* set languages */}
      <LanguageSelectorModal
        isModalVisible={isLanguageModalVisible}
        toggleModal={toggleModalLanguage}
        language={language1}
        setLanguage={setLanguage1}
      />
    </Modal>
  );
}
