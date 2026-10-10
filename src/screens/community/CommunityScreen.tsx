// Postponed past v1 — not in the v1 navigator; see app/docs/v2_backlog.md
import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";
import { styled, DefaultTheme } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommunityStackParamList } from "../../navigation/types";

import { StyledProps } from "../../theme/styled-components";

type CommunityScreenNavigationProp = NativeStackNavigationProp<
  CommunityStackParamList,
  "CommunityFeed"
>;

const Container = styled(View)<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.primary};
`;

const Header = styled(View)<StyledProps>`
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.lg}px`};
`;

const Title = styled(Text)<StyledProps>`
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.h1}px`};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const Content = styled(View)<StyledProps>`
  flex: 1;
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
`;

const PostContainer = styled(TouchableOpacity)<StyledProps>`
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.lg}px`};
  padding: ${({ theme }: { theme: DefaultTheme }) => `${theme.spacing.md}px`};
  background-color: ${({ theme }: { theme: DefaultTheme }) =>
    theme.colors.background.card};
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
`;

const PostHeader = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const UserAvatar = styled(Image)<StyledProps>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.sm}px`};
`;

const UserInfo = styled(View)<StyledProps>`
  flex: 1;
`;

const UserName = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.display};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
`;

const PostTime = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.tertiary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
`;

const PostContent = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.body}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const PostImage = styled(Image)<StyledProps>`
  width: 100%;
  height: 200px;
  border-radius: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.borderRadius.md}px`};
  margin-bottom: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.md}px`};
`;

const PostActions = styled(View)<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
`;

const ActionButton = styled(TouchableOpacity)<StyledProps>`
  flex-direction: row;
  align-items: center;
`;

const ActionText = styled(Text)<StyledProps>`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.secondary};
  font-family: ${({ theme }: { theme: DefaultTheme }) =>
    theme.typography.fontFamily.text};
  font-size: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.typography.fontSize.small}px`};
  margin-left: ${({ theme }: { theme: DefaultTheme }) =>
    `${theme.spacing.xs}px`};
`;

// Mock data - replace with actual data from API
const posts = [
  {
    id: "1",
    userId: "user1",
    userName: "Coffee Enthusiast",
    userAvatar: "https://example.com/avatar1.jpg",
    timeAgo: "2 hours ago",
    content:
      "Just tried a new Ethiopian bean with my pour-over setup. The floral notes are incredible!",
    image: "https://example.com/coffee1.jpg",
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    userId: "user2",
    userName: "Barista Pro",
    userAvatar: "https://example.com/avatar2.jpg",
    timeAgo: "5 hours ago",
    content:
      "Perfecting my latte art today. Still need more practice with the rosetta pattern.",
    image: "https://example.com/coffee2.jpg",
    likes: 42,
    comments: 8,
  },
  {
    id: "3",
    userId: "user3",
    userName: "Home Brewer",
    userAvatar: "https://example.com/avatar3.jpg",
    timeAgo: "1 day ago",
    content:
      "My cold brew experiment turned out amazing! 24 hours of steeping really brings out the chocolate notes.",
    image: "https://example.com/coffee3.jpg",
    likes: 18,
    comments: 3,
  },
];

interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timeAgo: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
}

export const CommunityScreen = () => {
  const navigation = useNavigation<CommunityScreenNavigationProp>();
  const [postsList, setPostsList] = useState<Post[]>(posts);

  const handleLikePost = (postId: string) => {
    setPostsList(
      postsList.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <PostContainer
      onPress={() => navigation.navigate("PostDetails", { postId: item.id })}
    >
      <PostHeader>
        <UserAvatar source={{ uri: item.userAvatar }} />
        <UserInfo>
          <UserName>{item.userName}</UserName>
          <PostTime>{item.timeAgo}</PostTime>
        </UserInfo>
      </PostHeader>
      <PostContent>{item.content}</PostContent>
      {item.image && <PostImage source={{ uri: item.image }} />}
      <PostActions>
        <ActionButton onPress={() => handleLikePost(item.id)}>
          <ActionText>❤️ {item.likes}</ActionText>
        </ActionButton>
        <ActionButton>
          <ActionText>💬 {item.comments}</ActionText>
        </ActionButton>
        <ActionButton>
          <ActionText>Share</ActionText>
        </ActionButton>
      </PostActions>
    </PostContainer>
  );

  return (
    <Container>
      <Header>
        <Title>Community</Title>
      </Header>
      <Content>
        <FlatList
          data={postsList}
          renderItem={renderPostItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </Content>
    </Container>
  );
};
