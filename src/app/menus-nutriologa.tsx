
import { router } from 'expo-router';
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

const API_URL = 'https://troyafit-api.onrender.com';

type Estudiante = {
  id_usuario: number;
  nombre: string;
  apellidos: string;
  correo: string;
};

export default function MenusNutriologa() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarEstudiantes = async () => {
    try {
      const respuesta = await fetch(
        `${API_URL}/api/planes/estudiantes`
      );

      if (!respuesta.ok) {
        throw new Error('No se pudieron consultar los estudiantes.');
      }

      const datos = await respuesta.json();
      setEstudiantes(datos);
    } catch (error) {
      Alert.alert(
        'Error',
        'No fue posible cargar los estudiantes.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Menús personalizados 🥗</Text>

      <Text style={styles.subtitulo}>
        Selecciona un estudiante para diseñar su plan alimenticio.
      </Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#4089C0" />
      ) : estudiantes.length === 0 ? (
        <Text style={styles.vacio}>
          No hay estudiantes registrados.
        </Text>
      ) : (
        estudiantes.map((estudiante) => (
          <View key={estudiante.id_usuario} style={styles.tarjeta}>
            <Text style={styles.icono}>👩‍🎓</Text>

            <Text style={styles.nombre}>
              {estudiante.nombre} {estudiante.apellidos}
            </Text>

            <Text style={styles.correo}>
              {estudiante.correo}
            </Text>

            <TouchableOpacity
              style={styles.boton}
              onPress={() =>
                router.push({
                  pathname: '/crear-plan',
                  params: {
                    id_estudiante: String(estudiante.id_usuario),
                    nombre: estudiante.nombre,
                    apellidos: estudiante.apellidos,
                  },
                })
              }
            >
              <Text style={styles.textoBoton}>
                Crear plan alimenticio
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1e8cf',
    padding: 22,
    paddingTop: 55,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 22,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 3,
  },
  icono: {
    fontSize: 28,
    marginBottom: 8,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  correo: {
    fontSize: 13,
    color: '#777',
    marginTop: 5,
    marginBottom: 15,
  },
  boton: {
    backgroundColor: '#4089C0',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  vacio: {
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
});
