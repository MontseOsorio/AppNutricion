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

const API_URL = 'http://192.168.0.10:3000';

interface Estudiante {
  id_usuario: number;
  nombre: string;
  apellidos: string;
  correo: string;
}

export default function EstudiantesNutriologa() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [cargando, setCargando] = useState(true);

  const obtenerEstudiantes = async () => {
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
      console.error('Error al obtener estudiantes:', error);

      Alert.alert(
        'Error',
        'No fue posible cargar los estudiantes.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEstudiantes();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Mis estudiantes 👩‍🎓</Text>

      <Text style={styles.subtitulo}>
        Consulta los estudiantes registrados en TroyaFit.
      </Text>

      {cargando ? (
        <ActivityIndicator size="large" color="#4089C0" />
      ) : estudiantes.length === 0 ? (
        <View style={styles.tarjeta}>
          <Text style={styles.vacio}>
            Todavía no hay estudiantes registrados.
          </Text>
        </View>
      ) : (
       estudiantes.map((estudiante) => (
  <TouchableOpacity
    key={estudiante.id_usuario}
    style={styles.tarjeta}
    activeOpacity={0.8}
    onPress={() =>
      router.push({
        pathname: '/expediente-estudiante',
        params: {
          id_estudiante: String(estudiante.id_usuario),
        },
      })
    }
  >
    <Text style={styles.icono}>👤</Text>

    <Text style={styles.nombre}>
      {estudiante.nombre} {estudiante.apellidos}
    </Text>

    <Text style={styles.correo}>
      {estudiante.correo}
    </Text>
  </TouchableOpacity>
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
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 15,
    color: '#555',
    marginTop: 5,
    marginBottom: 25,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    marginBottom: 17,
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
    fontSize: 14,
    color: '#666',
    marginTop: 7,
  },
  vacio: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
  },
});
