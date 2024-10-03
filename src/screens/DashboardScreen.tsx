import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import api from "../utils/api";
import Button from "../components/Button";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface UserAccount {
  id: number;
  name: string;
  email: string;
}

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const currentUser = useSelector((state: RootState) => state.user);
  const currentUserId = currentUser.user?.accountId;
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const response = await api.get("userAccount");
        setUserAccounts(response.data);
      } catch (error) {
        setError("Failed to fetch user accounts");
        Alert.alert("Error", "Failed to Fetch user accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAccounts();
  }, []);

  const handleEditAccount = (account: UserAccount) => {
    setEditingId(account.id);
    setEditingName(account.name);
    setEditingEmail(account.email);
  };

  const handleSaveAccount = async (id: number) => {
    try {
      const updatedAccount = {
        name: editingName,
        email: editingEmail,
      };

      await api.put(`userAccount/${id}`, updatedAccount);
      setUserAccounts(
        userAccounts.map((account) =>
          account.id === id
            ? { ...account, name: editingName, email: editingEmail }
            : account
        )
      );
      setEditingId(null);
    } catch (error) {
        Alert.alert("Error", "Failed to save account. Please try again.");
    }
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await api.delete(`userAccount/${id}`);
      setUserAccounts(userAccounts.filter((account) => account.id !== id));
    } catch (error) {
        Alert.alert("Error", "Failed to delete account. Please try again.");
    }
  };

  const handleBack = () => {
    setEditingId(null);
  };

  const handleEditPassword = () => {
    setEditingPassword(true);
  };

  const handleConfirmPassword = async () => {
    if (newPassword) {
      try {
        await api.patch(`userAccount/${currentUserId}`, newPassword);
        setEditingPassword(false);
        navigation.navigate("Login");
      } catch (error) {
        Alert.alert("Error", "Failed to change password. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    navigation.navigate("Login");
  };

  const renderItem = ({ item }: { item: UserAccount }) => (
    <View style={styles.itemContainer}>
      {editingId === item.id ? (
        <>
          <TextInput
            style={styles.input}
            value={editingName}
            onChangeText={setEditingName}
            placeholder="Name"
          />
          <TextInput
            style={styles.input}
            value={editingEmail}
            onChangeText={setEditingEmail}
            placeholder="Email"
          />
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={() => handleSaveAccount(item.id)} />
            <Button title="Back" onPress={handleBack} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Edit" onPress={() => handleEditAccount(item)} />
            <Button
              title="Delete"
              onPress={() => handleDeleteAccount(item.id)}
            />
          </View>
        </>
      )}
    </View>
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topButtonsContainer}>
        <Button title="Edit Password" onPress={handleEditPassword} />
        <Button title="Logout" onPress={handleLogout} />
      </View>

      {editingPassword && (
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="New Password"
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="Confirm" onPress={handleConfirmPassword} />
            <Button title="Close" onPress={() => setEditingPassword(false)} />
          </View>
        </View>
      )}

      <Text style={styles.title} testID="header">Dashboard</Text>
      <FlatList
        data={userAccounts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  passwordContainer: {
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default DashboardScreen;
