
import { router, useLocalSearchParams } from 'expo-router';
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

interface Consulta {
  id_consulta: number;
  fecha_consulta: string;
  motivo?: string;
  observaciones?: string;
  diagnostico_nutricional?: string;
  recomendaciones?: string;
  seguimiento?: string;
}

interface Medicion {
  id_medicion: number;
  fecha_medicion: string;
  peso_kg?: number | string;
  estatura_cm?: number | string;
  porcentaje_grasa?: number | string;
  observaciones?: string;
}

export default function ExpedienteEstudiante() {
  const { id_estudiante } = useLocalSearchParams<{
    id_estudiante: string;
  }>();

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [cargando, setCargando] = useState(true);

  const obtenerExpediente = async () => {
    try {
      const [respuestaConsultas, respuestaMediciones] =
        await Promise.all([
          fetch(`${API_URL}/api/consultas/estudiante/${id_estudiante}`),
          fetch(`${API_URL}/api/mediciones/estudiante/${id_estudiante}`),
        ]);

      if (!respuestaConsultas.ok || !respuestaMediciones.ok) {
        throw new Error('No se pudo cargar el expediente.');
      }

      const datosConsultas = await respuestaConsultas.json();
      const datosMediciones = await respuestaMediciones.json();

      setConsultas(datosConsultas);
      setMediciones(datosMediciones);

    } catch (error) {
      console.error('Error al cargar expediente:', error);
      Alert.alert(
        'Error',
        'No fue posible cargar el expediente del estudiante.'
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (id_estudiante) {
      obtenerExpediente();
    }
  }, [id_estudiante]);

  const formatoFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Expediente del estudiante 👩‍🎓</Text>

      <Text style={styles.subtitulo}>
        Historial nutricional y seguimiento.
      </Text>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>Número de expediente</Text>
        <Text style={styles.valor}>{id_estudiante}</Text>
      </View>
        <TouchableOpacity
  style={styles.boton}
  activeOpacity={0.8}
  onPress={() =>
    router.push({
      pathname: '/registrar-consulta',
      params: {
        id_estudiante: String(id_estudiante),
      },
    })
  }
>
  <Text style={styles.textoBoton}>+ Registrar consulta</Text>
</TouchableOpacity>
      {cargando ? (
        <ActivityIndicator size="large" color="#4089C0" />
      ) : (
        <>
          <Text style={styles.seccion}>🩺 Historial de consultas</Text>

          {consultas.length === 0 ? (
            <View style={styles.tarjeta}>
              <Text style={styles.vacio}>
                Todavía no hay consultas registradas.
              </Text>
            </View>
          ) : (
            consultas.map((consulta) => (
              <View key={consulta.id_consulta} style={styles.tarjeta}>
                <Text style={styles.fecha}>
                  {formatoFecha(consulta.fecha_consulta)}
                </Text>

                {consulta.motivo ? (
                  <Text style={styles.detalle}>
                    Motivo: {consulta.motivo}
                  </Text>
                ) : null}

                {consulta.observaciones ? (
                  <Text style={styles.detalle}>
                    Observaciones: {consulta.observaciones}
                  </Text>
                ) : null}

                {consulta.diagnostico_nutricional ? (
                  <Text style={styles.detalle}>
                    Diagnóstico: {consulta.diagnostico_nutricional}
                  </Text>
                ) : null}

                {consulta.recomendaciones ? (
                  <Text style={styles.detalle}>
                    Recomendaciones: {consulta.recomendaciones}
                  </Text>
                ) : null}

                {consulta.seguimiento ? (
                  <Text style={styles.detalle}>
                    Seguimiento: {consulta.seguimiento}
                  </Text>
                ) : null}
              </View>
            ))
          )}

          <Text style={styles.seccion}>⚖️ Historial de mediciones</Text>

          {mediciones.length === 0 ? (
            <View style={styles.tarjeta}>
              <Text style={styles.vacio}>
                Todavía no hay mediciones registradas.
              </Text>
            </View>
          ) : (
            mediciones.map((medicion) => (
              <View key={medicion.id_medicion} style={styles.tarjeta}>
                <Text style={styles.fecha}>
                  {formatoFecha(medicion.fecha_medicion)}
                </Text>

                <Text style={styles.detalle}>
                  Peso: {medicion.peso_kg ?? 'Sin registro'} kg
                </Text>

                <Text style={styles.detalle}>
                  Estatura: {medicion.estatura_cm ?? 'Sin registro'} cm
                </Text>

                <Text style={styles.detalle}>
                  Grasa corporal: {medicion.porcentaje_grasa ?? 'Sin registro'}%
                </Text>

                {medicion.observaciones ? (
                  <Text style={styles.detalle}>
                    Observaciones: {medicion.observaciones}
                  </Text>
                ) : null}
              </View>
            ))
          )}
        </>
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
    fontSize: 15,
    color: '#555',
    marginTop: 5,
    marginBottom: 22,
  },
  tarjeta: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 3,
  },
  etiqueta: {
    color: '#666',
    fontSize: 14,
  },
  valor: {
    color: '#1F416A',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  seccion: {
    color: '#1F416A',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 13,
  },
  fecha: {
    color: '#4089C0',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detalle: {
    color: '#555',
    fontSize: 14,
    marginTop: 6,
    lineHeight: 21,
  },
  vacio: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
  },
  boton: {
  backgroundColor: '#4089C0',
  padding: 15,
  borderRadius: 14,
  alignItems: 'center',
  marginBottom: 15,
},
textoBoton: {
  color: '#fff',
  fontSize: 15,
  fontWeight: 'bold',
},
});
