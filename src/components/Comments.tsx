// Postponed past V1 — only non-V1 screens use this; see docs/v2_backlog.md
import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { styled, DefaultTheme } from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { StyledProps } from "../theme/styled-components";
import type { Comment } from "../types/comment";

interface CommentsProps {
  comments: Comment[];
  currentUserId: string;
  onAddComment?: (text: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    fontSize: 20,
    marginBottom: 8,
  },
  item: {
    flexDirection: "row",
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    padding: 4,
  },
  input: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  addButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
});

const StyledContainer = styled(View)<StyledProps>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.primary};
`;

const StyledHeader = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const StyledItem = styled(View)<StyledProps>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
`;

const StyledUserName = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const StyledCommentText = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
`;

const StyledDate = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
`;

const StyledIcon = styled(Ionicons)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.functional.error};
`;

const StyledInput = styled(TextInput)<StyledProps>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.secondary};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
`;

const StyledAddButton = styled(TouchableOpacity)<StyledProps>`
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.accent.gold};
`;

const StyledAddButtonText = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
`;

export const Comments: React.FC<CommentsProps> = ({
  comments,
  currentUserId,
  onAddComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <StyledItem style={styles.item}>
      {item.userAvatar ? (
        <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar}>
          <Ionicons name="person-circle-outline" size={40} color="#999" />
        </View>
      )}
      <View style={styles.content}>
        <StyledUserName style={styles.userName}>{item.userName}</StyledUserName>
        <StyledCommentText style={styles.commentText}>
          {item.text}
        </StyledCommentText>
        <StyledDate style={styles.date}>
          {formatDate(item.createdAt)}
        </StyledDate>
      </View>
      {item.userId === currentUserId && onDeleteComment && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteComment(item.id)}
        >
          <StyledIcon name="trash-outline" size={20} />
        </TouchableOpacity>
      )}
    </StyledItem>
  );

  return (
    <StyledContainer style={styles.container}>
      <StyledHeader style={styles.header}>Comments</StyledHeader>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <StyledCommentText>No comments yet</StyledCommentText>
        }
      />
      <StyledInput
        style={styles.input}
        placeholder="Add a comment..."
        placeholderTextColor="#999"
        value={newComment}
        onChangeText={setNewComment}
        multiline
      />
      <StyledAddButton style={styles.addButton} onPress={handleAddComment}>
        <StyledAddButtonText>Add Comment</StyledAddButtonText>
      </StyledAddButton>
    </StyledContainer>
  );
};
