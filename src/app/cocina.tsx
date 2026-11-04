
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEY = '@troyafit_mi_cocina';

type KitchenItem = {
  id: string;
  name: string;
  emoji: string;
};

const appliances: KitchenItem[] = [
  { id: 'freidora', name: 'Freidora de aire', emoji: '🍟' },
  { id: 'licuadora', name: 'Licuadora', emoji: '🥤' },
  { id: 'microondas', name: 'Microondas', emoji: '♨️' },
  { id: 'estufa', name: 'Estufa', emoji: '🔥' },
  { id: 'parrilla', name: 'Parrilla eléctrica', emoji: '🍳' },
  { id: 'tostadora', name: 'Tostadora', emoji: '🍞' },
  { id: 'horno', name: 'Horno', emoji: '🥧' },
  { id: 'batidora', name: 'Batidora', emoji: '🧁' },
  { id: 'cafetera', name: 'Cafetera', emoji: '☕' },
  { id: 'sandwichera', name: 'Sandwichera', emoji: '🥪' },
];

const utensils: KitchenItem[] = [
  { id: 'sarten', name: 'Sartén', emoji: '🍳' },
  { id: 'ollas', name: 'Ollas', emoji: '🥘' },
  { id: 'cuchillos', name: 'Cuchillos', emoji: '🔪' },
  { id: 'tabla', name: 'Tabla de cortar', emoji: '🪵' },
  { id: 'colador', name: 'Colador', emoji: '🥣' },
  { id: 'batidor', name: 'Batidor manual', emoji: '🥄' },
  { id: 'moldes', name: 'Moldes', emoji: '🧁' },
  { id: 'recipientes', name: 'Recipientes', emoji: '🥡' },
  { id: 'espátula', name: 'Espátula', emoji: '🍴' },
];

export default function CocinaScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar los elementos guardados
  useEffect(() => {
    const loadKitchen = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved) {
          setSelected(JSON.parse(saved));
        }
      } catch (error) {
        console.log('Error al cargar la cocina:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKitchen();
  }, []);

  // Seleccionar o quitar un elemento
  const toggleItem = (id: string) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  // Guardar selección
  const saveKitchen = async () => {
    try {
      setSaving(true);

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(selected)
      );

      Alert.alert(
        '¡Cocina guardada! 💙',
        'Tus utensilios y electrodomésticos se guardaron correctamente. TroyaFit podrá utilizarlos para recomendarte recetas.'
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo guardar tu cocina. Inténtalo nuevamente.'
      );
    } finally {
      setSaving(false);
    }
  };

  // Tarjeta de cada elemento
  const renderItem = (item: KitchenItem) => {
    const isSelected = selected.includes(item.id);

    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.75}
        onPress={() => toggleItem(item.id)}
        style={[
          styles.itemCard,
          isSelected && styles.itemSelected,
        ]}
      >
        <View
          style={[
            styles.emojiContainer,
            isSelected && styles.emojiSelected,
          ]}
        >
          <Text
            style={[
              styles.itemEmoji,
              !isSelected && styles.grayEmoji,
            ]}
          >
            {item.emoji}
          </Text>
        </View>

        <Text
          style={[
            styles.itemName,
            isSelected && styles.selectedText,
          ]}
        >
          {item.name}
        </Text>

        <View
          style={[
            styles.checkCircle,
            isSelected && styles.checkSelected,
          ]}
        >
          {isSelected && (
            <Text style={styles.checkText}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F416A" />
        <Text style={styles.loadingText}>
          Preparando tu cocina...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.greeting}>TU ESPACIO PERSONAL</Text>
            <Text style={styles.title}>Mi cocina 🍃</Text>
            <Text style={styles.subtitle}>
              ¡Cuéntanos con qué cuentas en casa!
              Así podremos adaptar tus recetas a ti.
            </Text>
          </View>

          <View style={styles.headerIllustration}>
            <Text style={styles.bigEmoji}>👩🏻‍🍳</Text>
            <View style={styles.illustrationBadge}>
              <Text style={styles.badgeEmoji}>🥑</Text>
            </View>
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Text style={styles.summaryEmoji}>🏡</Text>
          </View>

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>
              Tu cocina, tus posibilidades
            </Text>
            <Text style={styles.summaryDescription}>
              Selecciona todo lo que tienes disponible.
            </Text>
          </View>

          <View style={styles.counter}>
            <Text style={styles.counterNumber}>
              {selected.length}
            </Text>
            <Text style={styles.counterLabel}>seleccionados</Text>
          </View>
        </View>

        {/* Electrodomésticos */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionEmoji}>⚡</Text>
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                Electrodomésticos
              </Text>
              <Text style={styles.sectionSubtitle}>
                Los aparatos que tienes en casa
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            {appliances.map(renderItem)}
          </View>
        </View>

        {/* Utensilios */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionEmoji}>🍴</Text>
            </View>

            <View>
              <Text style={styles.sectionTitle}>
                Utensilios de cocina
              </Text>
              <Text style={styles.sectionSubtitle}>
                Herramientas que utilizas para cocinar
              </Text>
            </View>
          </View>

          <View style={styles.grid}>
            {utensils.map(renderItem)}
          </View>
        </View>

        {/* Consejo */}
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              ¡Un consejo para ti!
            </Text>
            <Text style={styles.tipDescription}>
              Entre más elementos registres, mejores
              recomendaciones de recetas podrá ofrecerte
              TroyaFit de acuerdo con tu cocina.
            </Text>
          </View>
        </View>

        {/* Botón guardar */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          onPress={saveKitchen}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.saveButtonText}>
                Guardar mi cocina
              </Text>
              <Text style={styles.saveButtonIcon}>♡</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Puedes modificar tus selecciones cuando quieras 💙
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1e8cf',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 35,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#f1e8cf',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#1F416A',
    marginTop: 12,
    fontSize: 14,
  },

  // Encabezado
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  headerTextContainer: {
    flex: 1,
    paddingRight: 5,
  },

  greeting: {
    color: '#4089C0',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  title: {
    color: '#1F416A',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  subtitle: {
    color: '#657486',
    fontSize: 13,
    lineHeight: 20,
    maxWidth: 230,
  },

  headerIllustration: {
    width: 95,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 3,
    shadowColor: '#1F416A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  bigEmoji: {
    fontSize: 53,
  },

  illustrationBadge: {
    position: 'absolute',
    bottom: -7,
    right: -5,
    backgroundColor: '#E1EEDC',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#f1e8cf',
  },

  badgeEmoji: {
    fontSize: 18,
  },

  // Resumen
  summaryCard: {
    backgroundColor: '#1F416A',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
  },

  summaryIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  summaryEmoji: {
    fontSize: 24,
  },

  summaryInfo: {
    flex: 1,
  },

  summaryTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 4,
  },

  summaryDescription: {
    color: '#D9E8F5',
    fontSize: 10,
  },

  counter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: 'center',
  },

  counterNumber: {
    color: '#1F416A',
    fontWeight: 'bold',
    fontSize: 19,
  },

  counterLabel: {
    color: '#657486',
    fontSize: 8,
  },

  // Secciones
  section: {
    marginBottom: 27,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionIcon: {
    backgroundColor: '#FFFFFF',
    width: 43,
    height: 43,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  sectionEmoji: {
    fontSize: 23,
  },

  sectionTitle: {
    color: '#1F416A',
    fontWeight: 'bold',
    fontSize: 17,
  },

  sectionSubtitle: {
    color: '#7B8490',
    fontSize: 11,
    marginTop: 3,
  },

  // Tarjetas
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  itemCard: {
    width: '31.5%',
    minHeight: 117,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingVertical: 12,
    paddingHorizontal: 5,
    marginBottom: 11,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E8E4DA',
    elevation: 2,
    shadowColor: '#1F416A',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  itemSelected: {
    backgroundColor: '#E2ECF5',
    borderColor: '#4089C0',
  },

  emojiContainer: {
    width: 49,
    height: 49,
    backgroundColor: '#ECEDEF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emojiSelected: {
    backgroundColor: '#FFFFFF',
  },

  itemEmoji: {
    fontSize: 27,
  },

  grayEmoji: {
    opacity: 0.55,
  },

  itemName: {
    color: '#727B85',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 7,
    minHeight: 27,
  },

  selectedText: {
    color: '#1F416A',
    fontWeight: 'bold',
  },

  checkCircle: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C9CED3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  checkSelected: {
    backgroundColor: '#4089C0',
    borderColor: '#4089C0',
  },

  checkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Consejo
  tipCard: {
    backgroundColor: '#E4EEDC',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 22,
  },

  tipEmoji: {
    fontSize: 25,
    marginRight: 11,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    color: '#426344',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  tipDescription: {
    color: '#60765E',
    fontSize: 11,
    lineHeight: 18,
  },

  // Botón
  saveButton: {
    backgroundColor: '#1F416A',
    borderRadius: 17,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#1F416A',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  saveButtonIcon: {
    color: '#FFFFFF',
    fontSize: 23,
    marginLeft: 10,
  },

  footerText: {
    textAlign: 'center',
    color: '#82909E',
    fontSize: 11,
    marginTop: 13,
  },
});
