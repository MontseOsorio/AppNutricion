import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { router } from 'expo-router';

export default function MenuCafeteria() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* Encabezado */}
        <View style={styles.encabezado}>
          <TouchableOpacity
            style={styles.botonRegresar}
            onPress={() => router.replace('/menu')}
            activeOpacity={0.7}
          >
            <Text style={styles.flechaRegresar}>‹</Text>
          </TouchableOpacity>

          <View style={styles.titulos}>
            <Text style={styles.titulo}>
              Menú de cafetería
            </Text>

            <Text style={styles.subtitulo}>
              Desayunos, comidas, ensaladas y opciones saludables
            </Text>
          </View>
        </View>

        {/* Icono principal */}
        <View style={styles.contenedorIcono}>
          <View style={styles.circuloIcono}>
            <Text style={styles.iconoPrincipal}>🍽️</Text>
          </View>
        </View>

        {/* ================= SECCIÓN: DESAYUNOS ================= */}
        <View style={styles.tarjetaSeccion}>
          <View style={styles.etiqueta}>
            <Text style={styles.textoEtiqueta}>☀️ DESAYUNOS</Text>
          </View>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Chilaquiles sencillos</Text>
            <Text style={styles.precioItem}>$40</Text>
          </View>
          <Text style={styles.kcalItem}>Adiciones para chilaquiles: Huevo (+$9), Pollo (+$20)</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Molletes</Text>
            <Text style={styles.precioItem}>$40</Text>
          </View>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Enfrijoladas</Text>
            <Text style={styles.precioItem}>$55</Text>
          </View>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Huevos al gusto</Text>
            <Text style={styles.precioItem}>$45</Text>
          </View>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Omelette</Text>
            <Text style={styles.precioItem}>$55</Text>
          </View>
</View>

        {/* ================= SECCIÓN: COMIDA ================= */}
        <View style={styles.tarjetaSeccion}>
          <View style={styles.etiqueta}>
            <Text style={styles.textoEtiqueta}>🍲 COMIDA</Text>
          </View>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Chilaquiles sencillos (verde o rojo)</Text>
            <Text style={styles.precioItem}>$40 - $46</Text>
          </View>
          <Text style={styles.kcalItem}>730 kcal | Adiciones: con pollo o con huevo</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Enchiladas (verdes o rojas, 4 pzas)</Text>
            <Text style={styles.precioItem}>$45 - $65</Text>
          </View>
          <Text style={styles.kcalItem}>1050 kcal (pollo) / 980 kcal (queso)</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Enfrijoladas (con queso)</Text>
            <Text style={styles.precioItem}>$45 - $55</Text>
          </View>
          <Text style={styles.kcalItem}>425 kcal</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Pechuga a la plancha</Text>
            <Text style={styles.precioItem}>$55 - $65</Text>
          </View>
          <Text style={styles.kcalItem}>730 kcal</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Quesadillas (maíz o harina)</Text>
            <Text style={styles.precioItem}>$45 - $65</Text>
          </View>
          <Text style={styles.kcalItem}>380 kcal (maíz) / 580 kcal (harina)</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Club Sandwich</Text>
            <Text style={styles.precioItem}>$95</Text>
          </View>
        </View>

        {/* ================= SECCIÓN: ENSALADAS ================= */}
        <View style={styles.tarjetaSeccion}>
          <View style={styles.etiqueta}>
            <Text style={styles.textoEtiqueta}>🥗 ENSALADAS (Gde / Media)</Text>
          </View>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Madriguera</Text>
            <Text style={styles.precioItem}>$85 / $45</Text>
          </View>
          <Text style={styles.kcalItem}>270 kcal | Lechuga, tomate cherry, pepino, champiñones, elotitos, zanahoria, tortillitas, proteína a elegir y aderezo ranch o chipotle.</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>César</Text>
            <Text style={styles.precioItem}>$85 / $45</Text>
          </View>
          <Text style={styles.kcalItem}>260 kcal | Lechugas, crotones, parmesano, aderezo ranch y pollo.</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Vegetariana</Text>
            <Text style={styles.precioItem}>$85 / $45</Text>
          </View>
          <Text style={styles.kcalItem}>230 kcal | Lechugas, elote, zanahoria, fusilli, edamames, jitomate, tortillitas, aderezo ranch, panela.</Text>

          <View style={styles.separador} />
          <Text style={styles.tituloInformacion}>Proteínas a elegir:</Text>
          <Text style={styles.textoInformacion}>• Pollo a la plancha / Pollo deshebrado</Text>
          <Text style={styles.textoInformacion}>• Jamón / Panela</Text>
        </View>

        {/* ================= SECCIÓN: BEBIDAS Y SMOOTHIES ================= */}
        <View style={styles.tarjetaSeccion}>
          <View style={styles.etiqueta}>
            <Text style={styles.textoEtiqueta}>☕ BEBIDAS Y SMOOTHIES</Text>
          </View>


          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Smoothies (Sunny, Berries, Tropical, Choco Monkey)</Text>
            <Text style={styles.precioItem}>$50</Text>
          </View>
          <Text style={styles.kcalItem}>Naturales y sin azúcar (Ideal como opción de colación)</Text>

          <View style={styles.itemFila}>
            <Text style={styles.nombreItem}>Agua natural / Agua del día</Text>
            <Text style={styles.precioItem}>$15</Text>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.tarjetaInformacion}>
          <View style={styles.iconoInformacion}>
            <Text style={styles.emojiInformacion}>💡</Text>
          </View>

          <View style={styles.contenidoInformacion}>
            <Text style={styles.tituloInformacion}>
              Recomendación TroyaFit
            </Text>

            <Text style={styles.textoInformacion}>
              • Consulta las porciones equivalentes con tu plan nutricional asignado.
            </Text>

            <Text style={styles.textoInformacion}>
              • Los smoothies sin azúcar son excelentes opciones para tus colaciones entre comidas.
            </Text>
            <Text style={styles.textoInformacion}>
              • Pide tus chilaquiles sin bolillo
            </Text>
          </View>
        </View>

        {/* Mensaje final */}
        <View style={styles.mensajeFinal}>
          <Text style={styles.textoFinal}>
            TroyaFit 💙
          </Text>

          <Text style={styles.subtextoFinal}>
            Alimentación saludable también fuera de casa.
          </Text>
        </View>

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
    paddingTop: 45,
    paddingBottom: 35,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  botonRegresar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  flechaRegresar: {
    fontSize: 32,
    color: '#4089C0',
    lineHeight: 35,
    marginTop: -4,
  },
  titulos: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F416A',
  },
  subtitulo: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },
  contenedorIcono: {
    alignItems: 'center',
    marginVertical: 18,
  },
  circuloIcono: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: '#dcecf8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconoPrincipal: {
    fontSize: 55,
  },
  tarjetaSeccion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 23,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },
  etiqueta: {
    backgroundColor: '#e5eedf',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  textoEtiqueta: {
    fontSize: 10,
    fontWeight: '800',
    color: '#55734D',
    letterSpacing: 0.7,
  },
  itemFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  nombreItem: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F416A',
    flex: 1,
    paddingRight: 10,
  },
  precioItem: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4089C0',
  },
  kcalItem: {
    fontSize: 11,
    color: '#777777',
    marginBottom: 6,
  },
  separador: {
    width: '100%',
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  tarjetaInformacion: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconoInformacion: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#f1e8cf',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emojiInformacion: {
    fontSize: 20,
  },
  contenidoInformacion: {
    flex: 1,
  },
  tituloInformacion: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1F416A',
    marginBottom: 9,
  },
  textoInformacion: {
    fontSize: 11,
    color: '#666666',
    marginBottom: 7,
    lineHeight: 17,
  },
  mensajeFinal: {
    alignItems: 'center',
    marginTop: 5,
    paddingVertical: 10,
  },
  textoFinal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4089C0',
  },
  subtextoFinal: {
    fontSize: 10,
    color: '#888888',
    marginTop: 4,
    textAlign: 'center',
  },
});