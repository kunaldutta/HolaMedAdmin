import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Platform, 
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Members = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMembers = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const response = await fetch('https://developersdumka.in/ourmarket/Medicine/get_med_admin.php');
      const text = await response.text();
      console.log('Raw response:', text);

      let data = [];
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON:', e);
      }

      console.log('Parsed members:', data);
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchMembers(true);
  }, []);

  const handleRowPress = (item) => {
    setSelectedMember(item);
    setModalVisible(true);
  };

  const handleAction = async (action) => {
    if (!selectedMember?.id) return;
    setActionLoading(true);

    try {
      const response = await fetch('https://developersdumka.in/ourmarket/Medicine/update_med_admin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedMember.id,
          status: action === 'Approve' ? 'Approved' : 'Blocked',
        }),
      });

      const result = await response.json();
      console.log('Update result:', result);

      if (result.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === selectedMember.id
              ? { ...m, admin_approval: action === 'Approve' ? 'Approved' : 'Blocked' }
              : m
          )
        );
      } else {
        alert(result.error || 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Network error while updating member');
    } finally {
      setModalVisible(false);
      setTimeout(() => setActionLoading(false), 800);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMembers(false);
  };

  return (
    <SafeAreaView style={styles.containemain}>
      {/* Header */}
      <View
  style={{
        marginTop: Platform.OS === 'android' ? 30 : 0,
        height: 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
      }}
    >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButtonWrapper}
          activeOpacity={0.7}
        >
          <View style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Title in perfect center */}
        <Text style={styles.headerTitle}>Members</Text>
      </View>

      {/* List or Loader */}
      {loading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#4c4638ff" />
        </View>
      ) : (
        <View style={styles.container}>
          <FlatList
            data={members}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[
                  styles.cardRow, 
                  item?.admin_approval === 'Pending'
                    ? { backgroundColor: '#b56666ff' }
                    : item?.admin_approval === 'Approved'
                    ? { backgroundColor: '#818e49ff' }
                    : { backgroundColor: '#e83d0eff' }
                ]}
                onPress={() => handleRowPress(item)}
                activeOpacity={0.8}
              >
                <View>
                  <Text style={[styles.name, item?.admin_approval === 'Pending' && { color: '#daccccff' }]}>
                    {item?.admin_name}
                  </Text>
                  <Text style={[styles.access, item?.admin_approval === 'Pending' && { color: '#daccccff' }]}>
                    Access: {item?.admin_approval}
                  </Text>
                </View>
                <Icon name="ellipsis-v" size={20} color="#ede5e5ff" />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Action for {selectedMember?.admin_name}</Text>
            {selectedMember?.admin_approval !== 'Approved' && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#28a745' }]} 
                onPress={() => handleAction('Approve')}
              >
                <Text style={styles.actionText}>Approve</Text>
              </TouchableOpacity>
            )}
            {selectedMember?.admin_approval === 'Approved' && (
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#dc3545' }]} 
                onPress={() => handleAction('Block')}
              >
                <Text style={styles.actionText}>Block</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: '#6c757d' }]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Overlay Loader */}
      {actionLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containemain: {
    flex: 1,
    backgroundColor: 'white',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
  },
  backButtonWrapper: {
    position: 'absolute',
    left: 0,
    height: 50,      // full height of header
    width: 60,       // bigger clickable area
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,      // ensures it’s above other elements
  },
  backButton: {
    backgroundColor: 'black',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
    flex: 1,
  },
  cardRow: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1e8e8ff',
  },
  access: {
    fontSize: 14,
    color: '#e1c2c2ff',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  actionButton: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default Members;
