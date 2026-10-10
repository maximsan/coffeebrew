// Postponed past v1 — only non-v1 screens use this; see docs/v2_backlog.md
import React from "react";
import { View, Alert, Platform, PermissionsAndroid } from "react-native";
import { styled, DefaultTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

interface ImagePickerProps {
  imageUri?: string;
  onImageSelected: (uri: string) => void;
  aspect?: [number, number];
  quality?: number;
  size?: "small" | "medium" | "large";
}

type SizeType = "small" | "medium" | "large";

const Container = styled.View`
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.View<{ size: SizeType }>`
  width: ${({ size }: { size: SizeType }) =>
    size === "small" ? 100 : size === "medium" ? 200 : 300}px;
  height: ${({ size }: { size: SizeType }) =>
    size === "small" ? 100 : size === "medium" ? 200 : 300}px;
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  overflow: hidden;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  border: 1px dashed
    ${({ theme }: { theme: DefaultTheme }) => theme.colors.functional.border};
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.Image<{ size: SizeType }>`
  width: ${({ size }: { size: SizeType }) =>
    size === "small" ? 100 : size === "medium" ? 200 : 300}px;
  height: ${({ size }: { size: SizeType }) =>
    size === "small" ? 100 : size === "medium" ? 200 : 300}px;
  resize-mode: cover;
`;

const PlaceholderText = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const ActionButtons = styled.View`
  flex-direction: row;
  margin-top: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.sm}px`};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  margin: 0 ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.sm}px`};
`;

const ActionButtonText = styled.Text`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-left: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

export const ImagePickerComponent: React.FC<ImagePickerProps> = ({
  imageUri,
  onImageSelected,
  aspect = [4, 3],
  quality = 0.7,
  size = "medium",
}) => {
  const requestCameraPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission to take photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    }
  };

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Gallery Permission",
            message: "App needs gallery permission to select photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  const takePhoto = async () => {
    const permissionGranted = await requestCameraPermission();
    if (!permissionGranted) {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos.",
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect,
        quality,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error(error);
    }
  };

  const pickImage = async () => {
    const permissionGranted = await requestMediaLibraryPermission();
    if (!permissionGranted) {
      Alert.alert(
        "Permission Required",
        "Gallery permission is required to select photos.",
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect,
        quality,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  return (
    <Container>
      <ImageContainer size={size}>
        {imageUri ? (
          <StyledImage source={{ uri: imageUri }} size={size} />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="image-outline" size={40} color="#999" />
            <PlaceholderText>No image selected</PlaceholderText>
          </View>
        )}
      </ImageContainer>

      <ActionButtons>
        <ActionButton onPress={takePhoto}>
          <Ionicons name="camera-outline" size={24} color="#000000" />
          <ActionButtonText>Take Photo</ActionButtonText>
        </ActionButton>
        <ActionButton onPress={pickImage}>
          <Ionicons name="images-outline" size={24} color="#000000" />
          <ActionButtonText>Choose</ActionButtonText>
        </ActionButton>
      </ActionButtons>
    </Container>
  );
};
