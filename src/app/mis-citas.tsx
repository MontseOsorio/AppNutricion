
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://148.220.210.243:3000';
const ID_NUTRIOLOGA = 2;

export default function MisCitas() {
  const [citas, setCitas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarCitas = async () => {
    try {
      const usuarioGuardado = await AsyncStorage.getItem('usuario');

      if (!usuarioGuardado) {
        Alert.alert('Atención', 'No se encontró tu sesión.');
        return;
      }

      const usuario = JSON.parse(usuarioGuardado);

      const respuesta = await fetch(
        `${API_URL}/api/citas/${ID_NUTRIOLOGA}`
      );

      if (!respuesta.ok) {
        throw new Error('No se pudieron consultar las citas.');
      }

      const todasLasCitas = await respuesta.json();

      const misCitas = todasLasCitas.filter(
        (cita: any) =>
          Number(cita.id_estudiante) === Number(usuario.id_usuario)
      );

      setCitas(misCitas);
    } catch (error) {
      console.log('Error al cargar citas:', error);
      Alert.alert('Error', 'No se pudieron cargar tus citas.');
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCargando(true);
      cargarCitas();
    }, [])
  );

  const obtenerEstado = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return { texto: 'Confirmada', color: '#DDF2E3', textoColor: '#27834A' };
      case 'cancelada':
        return { texto: 'Cancelada', color: '#FBE1E1', textoColor: '#B83232' };
      case 'pendiente':
        return { texto: 'Pendiente', color: '#FFF0CF', textoColor: '#A87916' };
      default:
        return { texto: estado, color: '#EAEAEA', textoColor: '#666666' };
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.encabezado}>
          <TouchableOpacity
            style={styles.botonRegresar}
            onPress={() => router.back()}
          >
            <Text style={styles.flecha}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Mis citas</Text>

          <View style={{ width: 40 }} />
        </View>

        <Text style={styles.subtitulo}>
          Consulta el estado de tus citas con la nutrióloga.
        </Text>

        {cargando ? (
          <ActivityIndicator size="large" color="#4089C0" />
        ) : citas.length === 0 ? (
          <View style={styles.tarjetaVacia}>
            <Text style={styles.iconoVacio}>📅</Text>
            <Text style={styles.textoVacio}>
              Aún no tienes citas registradas.
            </Text>
    
          </View>
        ) : (
          citas.map((cita) => {
            const estado = obtenerEstado(cita.estado);

            return (
              <View key={cita.id_cita} style={styles.tarjeta}>
                <Text style={styles.tituloTarjeta}>
                  Consulta nutricional
                </Text>

                <View style={styles.dato}>
                  <Text style={styles.icono}>📅</Text>
                  <Text style={styles.valor}>{cita.fecha}</Text>
                </View>

                <View style={styles.dato}>
                  <Text style={styles.icono}>🕐</Text>
                  <Text style={styles.valor}>{cita.hora}</Text>
                </View>

                <View style={styles.estadoContenedor}>
                  <Text style={styles.etiquetaEstado}>Estado:</Text>
                  <View style={[styles.badge, { backgroundColor: estado.color }]}>
                    <Text style={{ color: estado.textoColor, fontWeight: '700' }}>
                      {estado.texto}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
                   {!cargando && (
          <TouchableOpacity
            style={styles.botonAgendar}
            onPress={() => router.push('/cita')}
          >
            <Text style={styles.textoBoton}>📅 Agendar nueva cita</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1e8cf',
  },
  scroll: {
    paddingHorizontal: 22,
    paddingTop: 50,
    paddingBottom: 30,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  botonRegresar: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flecha: {
    fontSize: 30,
    color: '#4089C0',
    marginTop: -3,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 22,
  },
  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },
  tituloTarjeta: {
    fontSize: 16,
    color: '#1F416A',
    fontWeight: '800',
    marginBottom: 15,
  },
  dato: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icono: {
    fontSize: 19,
    marginRight: 12,
  },
  valor: {
    fontSize: 14,
    color: '#444444',
    fontWeight: '600',
  },
  estadoContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  etiquetaEstado: {
    color: '#666666',
    fontSize: 13,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tarjetaVacia: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 25,
    alignItems: 'center',
    elevation: 3,
  },
  iconoVacio: {
    fontSize: 40,
    marginBottom: 12,
  },
  textoVacio: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 18,
  },
  botonAgendar: {
    backgroundColor: '#4089C0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 18,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
